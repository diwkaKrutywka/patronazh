<template>
  <div :class="['h-screen w-full flex overflow-hidden relative', theme === 'dark' ? 'theme-dark' : 'theme-light']">
    <button
      class="theme-toggle absolute right-16 top-3 z-30 w-10 h-6 flex justify-center items-center rounded opacity-80 text-white"
      @click="toggleTheme"
      :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <span class="material-symbols-outlined" style="font-size: 22px;">
        {{ theme === 'dark' ? 'dark_mode' : 'light_mode' }}
      </span>
    </button>
    <ChangeLanguageBox class="absolute rounded  opacity-80 right-3 top-3 text-white w-10 h-6 flex justify-center items-center " />
    <div class="w-full flex h-full">
      <div class="w-1/2 h-full flex justify-center items-center">
        <div class="rounded-xl p-8 w-96 flex flex-col gap-4 z-10">
          <div class="font-extrabold text-xl text-black text-start tracking-wide ">{{ $t('l_Sign_in') }}</div>
          <div class="font-ligh text-sm text-start text-[#444] mb-1">{{ $t('l_Enter_detail') }}</div>
          <div>
            <label for="username" class="input-label">{{ $t('l_Username') }}</label>
            <Input id="username" size="medium" class="input-dark small-input" v-model:value="info.username" :placeholder="$t('l_Username')" />
          </div>
          <div>
            <label for="password" class="input-label">{{ $t('l_Password') }}</label>
            <div style="position: relative; display: flex; align-items: center;">
              <Input
                id="password"
                size="medium"
                class="input-dark small-input"
                v-model:value="info.password"
                :placeholder="$t('l_Password')"
                :type="passwordVisible ? 'text' : 'password'"
              />
              <span
                @click="togglePasswordVisibility"
                style="position: absolute; right: 10px; cursor: pointer; color: #888; user-select: none; font-size: 15px;"
                :title="passwordVisible ? 'Hide password' : 'Show password'"
                class="material-symbols-outlined"
              >
                {{ passwordVisible ? 'visibility' : 'visibility_off' }}
              </span>
            </div>
          </div>
          <div
            class="login-btn text-center flex justify-center items-center bg-gradient-to-r from-[#a8a8a8] to-[#cccccc] text-white px-4 py-1.5 rounded-lg text-base cursor-pointer font-semibold shadow-md hover:scale-105 transition-transform duration-200"
            @click="onLogin"
          >
            {{ $t("l_Login") }}
          </div>
          <div class="forgot-password-link flex items-center gap-2 mb-1 justify-center">
            <span class="line"></span>
            <span class="forgot-link">{{ $t('l_Remember') }}</span>
            <span class="line"></span>
          </div>
        </div>
      </div>
    
      <div class="w-1/2 h-full flex justify-center items-center">
        <canvas ref="heartbeatCanvas" width="600"  height="200" style="background:transparent; "></canvas>
      </div>
    </div>
  </div>
  
  <footer class="footer-contact">
    <div class="footer-content">
      <span>Contact: </span>
      <a href="mailto:support@example.com" class="footer-link">support@example.com</a>
      <span class="footer-separator">|</span>
      <span>Phone: <a href="tel:+1234567890" class="footer-link">+1 234 567 890</a></span>
      <span class="footer-separator">|</span>
      <span>123 Main St, City, Country</span>
    </div>
  </footer>
</template>

<script>
import { Button, Input, message } from "ant-design-vue"
import ChangeLanguageBox from "../components/change-language-box.vue"
import config from "../config"
import { ApiApi } from "../api/auth"
import { useUserStore } from '../store/index.js'
const BaseUrl = config.baseURL
export default {
  components: {
    Button,
    Input,
    ChangeLanguageBox,
  },
  data() {
    return {
      info: {
        username: "",
        password: "",
      },
      passwordVisible: false,
      animationFrameId: null,
      heartbeatT: 0, 
      theme: localStorage.getItem('theme') || 'light',
    };
  },
  mounted() {
    this.startHeartbeatAnimation();
    document.body.classList.toggle('theme-dark', this.theme === 'dark');
    document.body.classList.toggle('theme-light', this.theme === 'light');
  },
  watch: {
    theme(newVal) {
      document.body.classList.toggle('theme-dark', newVal === 'dark');
      document.body.classList.toggle('theme-light', newVal === 'light');
      localStorage.setItem('theme', newVal);
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  },
  methods: {
      onLogin() {
  if (!this.info.username || !this.info.password) return

  ApiApi('login', this.info, 'POST').then((res) => {
    if (res.status === 200) {
      const { access_token, refresh_token, user } = res.data

      const userStore = useUserStore()
      userStore.setTokens(access_token, refresh_token) // <-- сохраняем токены
      userStore.setUserData(user) // <-- сохраняем пользователя

      this.$router.push("/")
    } else {
      message.error(res.message || 'Ошибка входа')
      console.log(res)
      console.log('error')
    }
  }).catch((err) => {
    const msg = err?.response?.data?.message || err?.message || 'Ошибка входа'
    message.error(msg)
  })
},
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
    },
    startHeartbeatAnimation() {
      const canvas = this.$refs.heartbeatCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

     
      const beatCount = 8;
      let beats = [];
      function generateBeat() {
       
        return {
          up: -60 - Math.random() * 40,
          down: 60 + Math.random() * 30,   
          up2: -20 - Math.random() * 20,  
          down2: 20 + Math.random() * 20,  
          width: 90 
        };
      }
      for (let i = 0; i < beatCount; i++) {
        beats.push(generateBeat());
      }

      let totalWidth = beats.reduce((sum, b) => sum + b.width, 0);

      let t = 0;

      const drawHeartbeat = () => {
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(0, height / 2);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#e63946';

        let x = 0;
        let offset = t % totalWidth;
        let beatIdx = 0;
        let beatX = 0;

       
        while (beatIdx < beats.length && offset > beats[beatIdx].width) {
          offset -= beats[beatIdx].width;
          beatIdx++;
        }

        ctx.moveTo(x, 0);

      
        while (x < width) {
          if (beatIdx >= beats.length) {
          
            const newBeat = generateBeat();
            beats.push(newBeat);
            totalWidth += newBeat.width;
          }
          const beat = beats[beatIdx];

          const seg = [
            { len: 6, y: 0 },
            { len: 4, y: beat.up },
            { len: 6, y: beat.down },
            { len: 4, y: beat.up2 },
            { len: 4, y: beat.down2 },
            { len: beat.width - 12, y: 0 }
          ];

          let segOffset = offset;
          for (let s = 0; s < seg.length && x < width; s++) {
            let segLen = seg[s].len - segOffset;
            if (segLen < 0) {
              segOffset -= seg[s].len;
              continue;
            }
            for (let i = 0; i < segLen && x < width; i += 2) {
              ctx.lineTo(x, seg[s].y);
              x += 2;
            }
            segOffset = 0;
          }
          offset = 0;
          beatIdx++;
        }

        ctx.stroke();
        ctx.restore();

        t += 2;

        let removeCount = 0;
        let sum = 0;
        while (removeCount < beats.length && sum + beats[removeCount].width < t) {
          sum += beats[removeCount].width;
          removeCount++;
        }
        if (removeCount > 0) {
          beats = beats.slice(removeCount);
          totalWidth = beats.reduce((sum, b) => sum + b.width, 0);
          t -= sum;
        }

        this.animationFrameId = requestAnimationFrame(drawHeartbeat);
      };

      drawHeartbeat();
    },
  },
};
</script>

<style scoped>
.bg-blur::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  backdrop-filter: blur(12px);
}

.input-dark .ant-input {
  background: #fff;
  color: #fff;
  border: 1px solid #888;
  transition: border-color 0.2s;
  opacity: 0.85;
  height: 36px;
  font-size: 15px;
  padding: 4px 10px;
}
.input-dark .ant-input::placeholder {
  color: #aaa;
}
.input-dark .ant-input:focus,
.input-dark .ant-input:hover {
  border-color: #fff;
  box-shadow: none;
}
.small-input .ant-input {
  height: 32px !important;
  font-size: 14px !important;
  padding: 2px 8px !important;
}
.login-btn {
  background: linear-gradient(90deg, #888888 0%, #6f7172 100%);
  border: none;
  transition: transform 0.2s;
  font-size: 16px;
  padding: 4px 0;
}
.login-btn:hover {
  background: linear-gradient(90deg, #6a6c6d 0%, #cccccc 100%);
  transform: scale(1.05);
}
.forgot-link {
  color: #888;
  cursor: pointer;
  transition: color 0.2s, text-decoration 0.2s;
  font-size: 14px;
}
.forgot-link:hover {
  color: #232526;
  text-decoration: underline;
}
.line {
  display: inline-block;
  height: 1px;
  width: 60px;
  background: #ccc;
  vertical-align: middle;
}
.input-label {
  display: block;
  color: #444;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 2px;
  margin-left: 2px;
  text-align: left;
}
.footer-contact {
  width: 100vw;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #f5f5f5;
  color: #444;
  text-align: center;
  padding: 10px 0 8px 0;
  font-size: 13px;
  border-top: 1px solid #e0e0e0;
  z-index: 20;
}
.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.footer-link {
  color: #444;
  text-decoration: underline dotted;
  transition: color 0.2s;
}
.footer-link:hover {
  color: #e63946;
}
.footer-separator {
  margin: 0 6px;
  color: #bbb;
}
/* Theme toggle button */
.theme-toggle {
  background: linear-gradient(90deg, #888888 0%, #6f7172 100%);
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  outline: none;
}
.theme-toggle:hover {
  background: linear-gradient(90deg, #232526 0%, #888888 100%);
}
/* Light theme (default) */
.theme-light {
  background: #f3f4f6;
  color: #222;
}
/* Dark theme */
.theme-dark {
  background: #181a1b !important;
  color: #f3f4f6 !important;
}
.theme-dark .rounded-xl {
  /* background: #232526 !important; */
  color: #e0e3e6 !important;

  /* box-shadow: 0 4px 24px 0 rgba(0,0,0,0.45), 0 1.5px 4px 0 rgba(0,0,0,0.18); */
}
.theme-dark .rounded-xl .input-label,
.theme-dark .rounded-xl .ant-input,
.theme-dark .rounded-xl .forgot-link {
  color: #e0e3e6 !important;
}
.theme-dark .rounded-xl .ant-input::placeholder {
  color: #aaa !important;
}
.theme-dark .input-dark .ant-input {
  
  color: #f3f4f6 !important;
  /* border: 1px solid #444 !important; */
}
.theme-dark .input-dark .ant-input::placeholder {
  color: #aaa !important;
}
.theme-dark .input-dark .ant-input:focus,
.theme-dark .input-dark .ant-input:hover {
  border-color: #f3f4f6 !important;
}
.theme-dark .login-btn {
  background: linear-gradient(90deg, #444 0%, #232526 100%) !important;
  color: #f3f4f6 !important;
}
.theme-dark .login-btn:hover {
  background: linear-gradient(90deg, #232526 0%, #444 100%) !important;
}
.theme-dark .footer-link {
  color: #f3f4f6 !important;
}
.theme-dark .footer-link:hover {
  color: #e63946 !important;
}
.theme-dark .footer-separator {
  color: #888 !important;
}
.theme-dark .font-extrabold.text-xl {
  color: #fff !important;
}
.theme-dark .font-ligh.text-sm {
  color: #fff !important;
}
@media (max-width: 768px) {
  .h-screen {
    height: auto;
    min-height: 100vh;
  }
  .w-full.flex.h-full {
    flex-direction: column;
    height: auto;
  }
  .w-1\/2.h-full.flex.justify-center.items-center {
    width: 100% !important;
    height: auto !important;
    min-height: unset;
    justify-content: center;
    align-items: flex-start;
    margin-top: 32px;
    margin-bottom: 16px;
  }
  .rounded-xl.p-8.w-96.flex.flex-col.gap-4.z-10 {
    width: 90vw !important;
    min-width: 0;
    padding: 18px 8px !important;
    box-sizing: border-box;
  }
  .footer-contact {
    font-size: 12px;
    padding: 8px 0 6px 0;
  }
  .footer-content {
    flex-direction: column;
    gap: 2px;
  }
  .forgot-link, .input-label {
    font-size: 12px !important;
  }
  .login-btn {
    font-size: 15px !important;
    padding: 4px 0 !important;
  }
  .line {
    width: 30px !important;
  }

  .w-1\/2.h-full.flex.justify-center.items-center:last-child {
    display: none !important;
  }
  canvas[ref="heartbeatCanvas"] {
    display: none !important;
  }
}
</style>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

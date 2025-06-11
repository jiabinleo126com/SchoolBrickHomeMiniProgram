import App from './App'
import uView from '@/uni_modules/uview-ui'
// #ifndef VUE3
import Vue from 'vue'
var QQMapWX = require('@/static/qqmap-wx-jssdk.min.js');
uni.$u.config.qqmapsdk = new QQMapWX({
	key: 'C5ZBZ-JXICR-SQCWM-WDQDY-V3YZH-BUF3T'
});
Vue.use(uView);
uni.$u.config.unit = 'rpx'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

import dashboard from './components/dashboard.vue';
import send from './components/send.vue';
import receive from './components/receive.vue';
import notification from './components/notification.vue';

export default [
    { path: '/', component: dashboard },
    { path: '/send', component: send },
    { path: '/receive', component: receive },
    { path: '/notification', component: notification }
]

<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container">
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" :nickname="nickname" :avatar="avatar" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Message from '@/components/library/Message'
export default {
  name: 'PageCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup () {
    const hasAccount = ref(true)
    // 首先：默认已经注册且已经绑定，通过QQ的api获取openId就是后台需要的uniond
    // 如果成功则登录成功，如果失败则该QQ未和小兔鲜进行绑定
    // 假设已经绑定，默认会去做一次登录，如果登录失败证明未绑定。
    const isBind = ref(true)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const unionId = ref(null)
    // 确保QQ已经登录
    if (QC.Login.check()) {
      // 获取第三方唯一标识
      QC.Login.getMe((openId) => {
        unionId.value = openId
        // 发起请求，做QQ登录
        userQQLogin(openId).then((data) => {
          // 登录成功
          // 存储用户信息
          const { id, account, nickname, avatar, mobile, token } = data.result
          store.commit('user/setUser', { id, account, nickname, avatar, mobile, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 跳转页面
            store.commit('user/setRedirectUrl', route.query.redirectUrl)
            router.push(store.state.user.redirectUrl)
            // 提示
            Message({ type: 'success', text: 'QQ登录成功' })
          })
        }).catch(e => {
          // 登录失败
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>

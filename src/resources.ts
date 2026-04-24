const resources = {
  'en-US': {
    translation: {
      // ==========================================
      // 1. 通用基础 (Common Basics)
      // 包含：按钮、通用动作、基础状态、常见通用名词
      // ==========================================
      add: 'Add',
      edit: 'Edit',
      ok: 'OK',
      reset: 'Reset',
      search: 'Search',

      // ==========================================
      // 2. 业务实体 (Business Entities)
      // 包含：设备、告警、用户、组织、任务、指令等核心业务名词
      // ==========================================
      avatar: 'Avatar',
      name: 'Name',
      phoneNumber: 'Phone number',

      // ==========================================
      // 3. 表单与交互提示 (Forms & Interaction Prompts)
      // 包含：输入提示、选择提示、确认弹窗、成功/失败消息
      // ==========================================
      success: 'Operation successful',
      unauthorized: 'User not authorized',
      verificationCode: 'Verification code',

      // ==========================================
      // 4. 系统与界面 (System & UI)
      // 包含：系统级名词、文件操作、图表、登录登出、主题等
      // ==========================================
      app: 'Laser Admin',
      darkTheme: 'Dark theme',
      lightTheme: 'Light theme',
      login: 'Login',
      logout: 'Logout',
      privacy: 'Privacy',
      terms: 'Terms',

      // ==========================================
      // 5. 时间与单位 (Time & Units)
      // 包含：时间相关和单位相关
      // ==========================================
      last3Months: 'Last 3 months',
      last6Months: 'Last 6 months',
      lastDay: 'Last day',
      lastMonth: 'Last month',
      lastWeek: 'Last week',
      lastYear: 'Last year',

      components: {
        language: {
          change: 'Change language',
        },
        table: {
          actions: 'ACTIONS',
          compact: 'Compact',
          default: 'Default',
          grid: 'Grid',
          layout: 'Layout',
          middle: 'Middle',
          more: 'More',
          refresh: 'Refresh',
          settings: 'Settings',
        },
        'table-filter': {
          advancedSearch: 'Advanced search',
        },
      },
      routes: {
        layout: {
          accountCenter: 'Account center',
          accountSettings: 'Account settings',
          changePassword: 'Change password',
          clearNotifications: 'Clear',
          enterNamePrompt: 'Please enter a name',
          enterNewPasswordPrompt: 'Please enter a new password',
          expandNav: 'Expand main navigation',
          foldNav: 'Fold main navigation',
          myAccount: 'My account',
          newPassword: 'New password',
          notification: 'Notification',
          seeMore: 'More',
        },
        login: {
          accountLogin: 'Account login',
          description: '{{what}} provides solutions for enterprise-level background management systems',
          enterCodePrompt: 'Please enter the verification code',
          enterNamePrompt: 'Please enter your username',
          enterPasswordPrompt: 'Please enter your password',
          enterPhonePrompt: 'Please enter your phone number',
          forgotPassword: 'Forgot password?',
          getCode: 'Get code',
          passwordHint: 'Password: any input',
          rememberMe: 'Remember me',
          usernameHint: "Username: 'admin' or 'user'",
        },
        exception: {
          backHome: 'Back home',
          e403: 'Sorry, you do not have permission to access this page',
          e404: 'Sorry, the page you visited does not exist',
          e500: 'Sorry, there was an internal server error',
        },
        test: {
          acl: {
            aclData: 'ACL data',
            switchUsers: 'Switch between different users to compare effects',
            testRouteGuard: 'Test route guard',
          },
        },
      },
    },
    title: {
      aMap: 'AMap',
      acl: 'ACL',
      dashboard: 'Dashboard',
      deviceDetail: 'Device detail',
      e403: '403',
      e404: '404',
      e500: '500',
      eCharts: 'ECharts',
      exception: 'Exception',
      home: 'Home',
      http: 'Http',
      list: 'List',
      login: 'Login',
      standardTable: 'Standard table',
      test: 'Test',
    },
  },
  'zh-CN': {
    translation: {
      // ==========================================
      // 1. 通用基础 (Common Basics)
      // 包含：按钮、通用动作、基础状态、常见通用名词
      // ==========================================
      add: '添加',
      edit: '编辑',
      ok: '确定',
      reset: '重置',
      search: '搜索',

      // ==========================================
      // 2. 业务实体 (Business Entities)
      // 包含：设备、告警、用户、组织、任务、指令等核心业务名词
      // ==========================================
      avatar: '头像',
      name: '用户名',
      phoneNumber: '手机号',

      // ==========================================
      // 3. 表单与交互提示 (Forms & Interaction Prompts)
      // 包含：输入提示、选择提示、确认弹窗、成功/失败消息
      // ==========================================
      success: '操作成功',
      unauthorized: '用户未授权',
      verificationCode: '验证码',

      // ==========================================
      // 4. 系统与界面 (System & UI)
      // 包含：系统级名词、文件操作、图表、登录登出、主题等
      // ==========================================
      app: 'Laser Admin',
      darkTheme: '深色主题',
      lightTheme: '浅色主题',
      login: '登录',
      logout: '退出登录',
      privacy: '隐私政策',
      terms: '服务条款',

      // ==========================================
      // 5. 时间与单位 (Time & Units)
      // 包含：时间相关和单位相关
      // ==========================================
      last3Months: '最近三月',
      last6Months: '最近半年',
      lastDay: '最近一天',
      lastMonth: '最近一月',
      lastWeek: '最近一周',
      lastYear: '最近一年',

      components: {
        language: {
          change: '切换语言',
        },
        table: {
          actions: '操作',
          compact: '紧凑',
          default: '默认',
          grid: '网格',
          layout: '布局',
          middle: '中等',
          more: '更多',
          refresh: '刷新',
          settings: '设置',
        },
        'table-filter': {
          advancedSearch: '高级搜索',
        },
      },
      routes: {
        layout: {
          accountCenter: '个人中心',
          accountSettings: '个人设置',
          changePassword: '修改密码',
          clearNotifications: '清空通知',
          enterNamePrompt: '请输入用户名',
          enterNewPasswordPrompt: '请输入新密码',
          expandNav: '展开主导航栏',
          foldNav: '折叠主导航栏',
          myAccount: '我的账户',
          newPassword: '新密码',
          notification: '通知',
          seeMore: '查看更多',
        },
        login: {
          accountLogin: '账号密码登录',
          description: '{{what}} 提供了企业级后台管理系统的解决方案',
          enterCodePrompt: '请输入验证码',
          enterNamePrompt: '请输入用户名',
          enterPasswordPrompt: '请输入密码',
          enterPhonePrompt: '请输入手机号',
          forgotPassword: '忘记密码？',
          getCode: '获取验证码',
          passwordHint: '密码：任意输入',
          rememberMe: '记住我',
          usernameHint: "用户名：'admin' 或 'user'",
        },
        exception: {
          backHome: '返回首页',
          e403: '抱歉，您无权访问该页面',
          e404: '抱歉，您访问的页面不存在',
          e500: '抱歉，服务器出错了',
        },
        test: {
          acl: {
            aclData: 'ACL 数据',
            switchUsers: '切换不同用户对比效果',
            testRouteGuard: '测试路由守卫',
          },
        },
      },
    },
    title: {
      aMap: '高德地图',
      acl: 'ACL',
      dashboard: '仪表盘',
      deviceDetail: '设备详情',
      e403: '403',
      e404: '404',
      e500: '500',
      eCharts: 'ECharts',
      exception: '异常页',
      home: '首页',
      http: 'Http',
      list: '列表',
      login: '登录',
      standardTable: '标准表格',
      test: '测试',
    },
  },
} as const;

export default resources;

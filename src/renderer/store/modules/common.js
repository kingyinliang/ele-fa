export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    // 包装车间
    Pkgfactoryid: '',
    PkgworkShop: '',
    PkgproductDate: '',
    // 包装车间数据录入传值
    PkgorderNo: '',
    // 炒麦车间
    FWworkShop: '', // 车间
    FWworkShopName: '',
    FWfactoryid: '', // 工厂
    FWfactoryName: '',
    FWproductLine: '', // 产线
    FWproductLineName: '',
    // yyMMdd
    FWproductDate: '', // 生产日期
    FWorderId: '',
    FWorderNo: '',
    // 脱皮产线
    PWorder: {
      orderId: '',
      orderNo: '',
      productLine: '', // 产线
      productLineName: '',
      // yyyyMMdd
      productDate: ''
    },
    // 制曲车间
    ZQWorkshop: {
      // 默认值
      defaultVal: {
        factoryId: '',
        factoryName: '',
        workshopId: '',
        workshopName: '',
        // 制曲日期
        zqDate: '',
        // normal/abnormal 正常生产/无生产
        productStatus: 'normal',
        // 订单管理页的订单日期
        orderDate: '',
        orderNo: '',
        orderStatus: ''
      },
      // 首页跳转到工序页参数
      params: {
        orderNo: '',
        orderId: '',
        // 煮豆
        beanOrderHouseId: '',
        // 出曲
        outOrderHouseId: '',
        // 看曲
        lookOrderHouseId: ''
      },
      // 订单管理页跳转到车间审核页的参数
      checkParams: {
        orderNo: '',
        orderId: ''
      }
    },
    SqueezeWorkshop: {
      factoryId: '',
      factoryName: '',
      workshopId: '',
      workshopName: '',
      // 布浆线
      productLineId: '',
      productLineName: '',
      // 领用日期
      applyDate: ''
    },
    /**
     * 压榨车间开罐申请参数
     */
    SqueezeApplyPot: {
      factoryId: '',
      factoryName: '',
      workshopId: '',
      workshopName: '',
      orderDate: '',
      applyId: ''
    },
    /**
     * 粮仓小麦罐
     */
    GranaryWheatPot: {
      factoryId: '',
      factoryName: '',
      workshopId: '',
      workshopName: '',
      holderId: '',
      holderName: ''
    },
    /**
     * 粮仓豆粕罐
     */
    BeanPulp: {
      holderId: '',
      factory: '',
      deptId: ''
    },
    /**
     * 发酵罐订单管理
     */
    FerOrderManage: {
      factoryId: '',
      factoryName: '',
      workshopId: '',
      workshopName: '',
      potId: '',
      potName: '',
      materialCode: '',
      materialName: '',
      startDate: '',
      endDate: ''
    },
    /**
     * 发酵罐入库管理参数
     */
    FerInStockManage: {
      factoryId: '',
      factoryName: '',
      workshopId: '',
      workshopName: '',
      startDate: '',
      endDate: '',
      // 罐号多选
      holderList: [],
      // 订单号多选
      orderList: [],
      // 状态
      status: ''
    },
    /*
     * 发酵车间
     */
    Fermentation: {
      orderId: '',
      details: {},
      materia: {
        factory: '',
        workShop: '',
        ferMaterialCode: '',
        ferOrderNos: [],
        holderIds: [],
        approveStatus: '',
        productDateOne: '',
        productDateTwo: ''
      },
      category: {
        factory: '',
        workShop: '',
        frozenStatus: '',
        holderId: '',
        orderNo: '',
        materialCode: '',
        ferDays: '',
        halfId: '',
        currPage: 1,
        pageSize: 10,
        totalCount: 0,
        isJudged: 0
      },
      instock: {}
    },
    /**
     * 杀菌车间
     */
    sterilized: {
      seiOrderId: '',
      acceOrderId: '',
      craftOrderId: '',
      inOrderId: '',
      seiFactory: '',
      seiOrderNo: '',
      inFactory: '',
      inOrderNo: '',
      acceFactory: '',
      acceOrderNo: '',
      factory: '',
      workshop: '',
      factoryId: '',
      workshopId: '',
      materialCode: '',
      materialName: '',
      orderNoList: [],
      orderNo: '',
      planOutputTotal: 0
    }
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
    updateFactoryid (state, name) {
      state.Pkgfactoryid = name
    },
    updateWorkShop (state, name) {
      state.PkgworkShop = name
    },
    updateProductDate (state, name) {
      state.PkgproductDate = name
    },
    updateOrderNo (state, name) {
      state.PkgorderNo = name
    },
    updateFWFactoryid (state, name) {
      state.FWfactoryid = name
    },
    updateFWWorkShop (state, name) {
      state.FWworkShop = name
    },
    updateFWProductDate (state, name) {
      state.FWproductDate = name
    },
    updateFWOrderNo (state, name) {
      state.FWorderNo = name
    },
    updateFWfactoryName (state, name) {
      state.FWfactoryName = name
    },
    updateFWWorkShopName (state, name) {
      state.FWworkShopName = name
    },
    updateFWorderId (state, name) {
      state.FWorderId = name
    },
    updateFWproductLine (state, name) {
      state.FWproductLine = name
    },
    updateFWproductLineName (state, name) {
      state.FWproductLineName = name
    },
    /* pw 小麦 start */
    updatePWorder (state, name) {
      state.PWorder = name
    },
    updatePWorderId (state, name) {
      state.PWorder.orderId = name
    },
    updatePWorderNo (state, name) {
      state.PWorder.orderNo = name
    },
    updatePWproductLine (state, name) {
      state.PWorder.productLine = name
    },
    updatePWproductLineName (state, name) {
      state.PWorder.productLineName = name
    },
    updatePWproductDate (state, name) {
      state.PWorder.productDate = name
    },
    /* pw 小麦 end */
    /** 制曲 start */
    updateZQDefault (state, name) {
      state.ZQWorkshop.defaultVal = name
    },
    updateZQParamsOrderNo (state, name) {
      state.ZQWorkshop.params.orderNo = name
    },
    updateZQParamsOrderId (state, name) {
      state.ZQWorkshop.params.orderId = name
    },
    updateZQParamsBeanHouseId (state, name) {
      state.ZQWorkshop.params.beanOrderHouseId = name
    },
    updateZQParamsOutHouseId (state, name) {
      state.ZQWorkshop.params.outOrderHouseId = name
    },
    updateZQParamsLookHouseId (state, name) {
      state.ZQWorkshop.params.lookOrderHouseId = name
    },
    updateZQCheckParamsOrderNo (state, name) {
      state.ZQWorkshop.checkParams.orderNo = name
    },
    updateZQCheckParamsOrderId (state, name) {
      state.ZQWorkshop.checkParams.orderId = name
    },
    /** 制曲 end */
    /** 压榨 */
    updateSqueezeWorkshop (state, name) {
      state.SqueezeWorkshop = name
    },
    updateSqueezeApplyPot (state, name) {
      state.SqueezeApplyPot = name
    },
    updateSqueezeApplyPotApplyId (state, applyId) {
      state.SqueezeApplyPot.applyId = applyId
    },
    /** 粮仓小麦罐 */
    updateGranaryWheatPot (state, params) {
      state.GranaryWheatPot = params
    },
    /** 粮仓豆粕罐 */
    updateBeanPulp (state, params) {
      state.BeanPulp = params
    },
    /** 发酵罐订单管理参数 */
    updateFerOrderManage (state, params) {
      state.FerOrderManage = params
    },
    /** 发酵罐入库管理参数 */
    updateFerInStockManage (state, params) {
      state.FerInStockManage = params
    },
    /** 发酵 */
    updateFermentation (state, params) {
      state.Fermentation = params
    },
    /** 发酵 */
    updateFermentationM (state, params) {
      state.Fermentation.materia = params
    },
    updateSterilized (state, params) {
      state.Sterilized = params
    }
  }
}

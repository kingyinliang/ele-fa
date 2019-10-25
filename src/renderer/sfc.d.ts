
/**
 * 告诉 TypeScript *.vue 后缀的文件可以交给 vue 模块来处理
 * 而在代码中导入 *.vue 文件的时候，需要写上 .vue 后缀。
 * 原因还是因为 TypeScript 默认只识别 *.ts 文件，不识别 *.vue 文件
 */
declare module "*.vue" {
    import Vue from 'vue'
    export default Vue
}

// import JQuery from 'jquery'
// declare let $: JQuery;
// export default $;

// declare module "jquery" {
//   import $ from 'jquery';
//   export default $
// }
// declare module "Vue-Cookies" {
//   export default VueCookies
// }
/**
 * test for declare
 * @param id 
 */
declare function getName(id: string): string
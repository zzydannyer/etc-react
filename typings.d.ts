declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

declare const Aliplayer: any;
declare const AliyunUpload: any;

// 路由权限
interface MenuObj {
  id: string;
  iconSkin?: string;
  urlPath?: string;
  systemName?: string;
  name?: string;
  pid?: string;
}

interface InitState {}

type InitialState = InitState;

// PageView 里面的
interface LinkRrouter {
  name: string;
  address?: string;
}

// 请求参数
type Params = Record<string, any>;
interface WindowSize {
  width?: number;
  height?: number;
}

type FormParams = Record<string, any>;

interface DomSize {
  width?: number;
  height?: number;
}
// 接口返回参数
interface AjaxRes {
  code?: string;
  data?: any;
  message?: string;
}
// 表格统一请求参数
interface TableParams {
  pageSize: number;
  pageNum: number;
  [key: string]: any;
}
// 表格大小
interface TableSize {
  width?: number;
  height?: number;
}

interface TransformData {
  name: any;
  value: any;
}

// 路由
interface NavTree {
  icon: string;
  name: string;
  level: number;
  parentId: number;
  type: number;
  orderNum?: number;
  delFlag?: number;
  id: number;
  url: string;
  children?: NavTree[] | [];
  selectFlag: boolean;
}
// 角色
interface RoleObj {
  createBy: string;
  createTime: string;
  lastUpdateBy: string;
  lastUpdateTime: string;
  name: string;
  remark: string;
  createById: number;
  delFlag: number;
  id: number;
  lastUpdateById: number;
  /**角色名称 */
  roleName: string;
}

interface HistoryRoute {
  title: string;
  key: string;
}

/**表格中显示的状态 */
type TableItemStatusText = 'Default' | 'Processing' | 'Success' | 'Error';

/**
 * 实际值 数据字典 静态数据类型
 */
interface CheckboxGroupOption {
  label: string;
  value: string | number;
  children?: CheckboxGroupOption;
}

/**
 * 静态信息
 */
interface CommonStaticInfo extends Params {
  /**试题类型 1:单选题 2:多选题 3:判断题*/
  T_TOPIC_INFO: CheckboxGroupOption[];
  /**课程分类  */
  T_COURSE_INFO: CheckboxGroupOption[];
  /**培训状态
   * value: 0, label: "未发布"
   * value: 1, label: "未开始",
   * value: 2, label: "进行中",
   * value: 3, label: "已结束",
   * value: 4, label: "已作废",
   *  */
  T_TRAIN_INFO: CheckboxGroupOption[];
}

interface ComboBox {
  comboBoxVOList: CheckboxGroupOption;
  type: string;
}

interface UploadInfo {
  videoId?: string;
  file?: File;
  bucket?: string;
  endpoint?: string;
  object?: any;
}

interface UploadAliyunPramse {
  uploadAuth?: string;
  uploadAddress?: string;
  /**视频id */
  videoId?: string;
}

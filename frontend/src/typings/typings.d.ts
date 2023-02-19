/* Image file types */
declare module "*.svg" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const content: string;

  export { ReactComponent };
  export default content;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

/* Font file types */
declare module "*.ttf";
declare module "*.otf";
declare module "*.eot";
declare module "*.woff";
declare module "*.woff2";

declare module "react-lottie-player";

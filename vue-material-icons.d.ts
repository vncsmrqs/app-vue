declare module 'vue-material-design-icons/*' {
  import { DefineComponent } from 'vue';

  interface IconProps {
    title?: string;
    fillColor?: string;
    size?: number;
  }

  interface IconEmits {
    (event: 'click', e: MouseEvent): void;
  }

  const component: DefineComponent<IconProps, unknown, IconEmits>;
  export default component;
}

import PropTypes from '../_util/vue-types';
import Trigger from '../vc-trigger';
import { placements } from './placements';
import Content from './Content';
import { hasProp, getComponent, getOptionProps } from '../_util/props-util';
function noop() {}
export default {
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    trigger: PropTypes.any.def(['hover']),
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
    placement: PropTypes.string.def('right'),
    transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    animation: PropTypes.any,
    afterVisibleChange: PropTypes.func.def(() => {}),
    overlay: PropTypes.any,
    overlayStyle: PropTypes.object,
    overlayClassName: PropTypes.string,
    prefixCls: PropTypes.string.def('rc-tooltip'),
    mouseEnterDelay: PropTypes.number.def(0),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    getTooltipContainer: PropTypes.func,
    destroyTooltipOnHide: PropTypes.bool.def(false),
    align: PropTypes.object.def(() => ({})),
    arrowContent: PropTypes.any.def(null),
    tipId: PropTypes.string,
    builtinPlacements: PropTypes.object,
  },
  methods: {
    getPopupElement() {
      const { prefixCls, tipId } = this.$props;
      return [
        <div class={`${prefixCls}-arrow`} key="arrow">
          {getComponent(this, 'arrowContent')}
        </div>,
        <Content
          key="content"
          trigger={this.$refs.trigger}
          prefixCls={prefixCls}
          id={tipId}
          overlay={getComponent(this, 'overlay')}
        />,
      ];
    },

    getPopupDomNode() {
      return this.$refs.trigger.getPopupDomNode();
    },
  },
  render(h) {
    const {
      overlayClassName,
      trigger,
      mouseEnterDelay,
      mouseLeaveDelay,
      overlayStyle,
      prefixCls,
      afterVisibleChange,
      transitionName,
      animation,
      placement,
      align,
      destroyTooltipOnHide,
      defaultVisible,
      getTooltipContainer,
      ...restProps
    } = getOptionProps(this);
    const extraProps = { ...restProps };
    if (hasProp(this, 'visible')) {
      extraProps.popupVisible = this.$props.visible;
    }
    const { $attrs } = this;
    const triggerProps = {
      popupClassName: overlayClassName,
      prefixCls,
      action: trigger,
      builtinPlacements: placements,
      popupPlacement: placement,
      popupAlign: align,
      getPopupContainer: getTooltipContainer,
      afterPopupVisibleChange: afterVisibleChange,
      popupTransitionName: transitionName,
      popupAnimation: animation,
      defaultPopupVisible: defaultVisible,
      destroyPopupOnHide: destroyTooltipOnHide,
      mouseLeaveDelay,
      popupStyle: overlayStyle,
      mouseEnterDelay,
      ...extraProps,
      ...$attrs,
      onPopupVisibleChange: $attrs.onVisibleChange || noop,
      onPopupAlign: $attrs.onPopupAlign || noop,
      ref: 'trigger',
      popup: this.getPopupElement(),
    };
    return <Trigger {...triggerProps}>{this.$slots.default && this.$slots.default()[0]}</Trigger>;
  },
};

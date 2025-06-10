import {
  IconCategory,
  IconDeviceDesktop,
  IconExclamationCircle,
  IconGavel,
  IconHome,
  IconLanguage,
  IconReceipt,
  IconShieldHalf,
  IconShieldLock,
  IconTemplate,
} from "@tabler/icons-react";

export const NAVS = [
  {
    labelKey: "navs.dashboard",
    path: "/dashboard",
    icon: IconHome,
  },
  {
    labelKey: "navs.product",
    path: "/product",
    icon: IconCategory,
  },
  {
    labelKey: "navs.template",
    path: "/template",
    icon: IconTemplate,
  },
  {
    labelKey: "navs.transaction",
    path: "/transaction",
    icon: IconReceipt,
  },
];

export const SETTINGS_NAVS = [
  {
    groupLabelKey: "settings_navs_group.main",
    list: [
      {
        icon: IconDeviceDesktop,
        labelKey: "settings_navs.display",
        path: "/settings/display",
      },
      {
        icon: IconLanguage,
        labelKey: "settings_navs.regional",
        path: "/settings/regional",
      },
      {
        icon: IconShieldHalf,
        labelKey: "settings_navs.permissions",
        path: "/settings/permissions",
      },
    ],
  },
  {
    groupLabelKey: "settings_navs_group.others",
    list: [
      {
        icon: IconExclamationCircle,
        labelKey: "settings_navs.report_problem",
        path: "/settings/report-problem",
      },
      {
        icon: IconGavel,
        labelKey: "settings_navs.terms_of_service",
        path: "/settings/terms-of-service",
      },
      {
        icon: IconShieldLock,
        labelKey: "settings_navs.privacy_policy",
        path: "/settings/privacy-policy",
      },
    ],
  },
];

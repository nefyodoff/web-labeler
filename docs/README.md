## About

**WebLabeler** is a handy web browser extension for web developers, testers, content managers, and others juggling
multiple environments (development, testing, staging, and production) daily. With this lightweight extension, you can
effortlessly create noticeable indicators that make your tabs easily distinguishable, helping you avoid mix-ups and
costly mistakes. Boost your productivity and stay organized with WebLabeler! 💪✨

## Installation

You can install WebLabeler directly from the Chrome Web Store or Firefox Add-ons (AMO) by clicking the link below:

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-red)](https://chromewebstore.google.com/detail/weblabeler-environment-ma/cgkfepnmpmgdcchpkjedadmiebkpbogl)
[![Firefox Add-ons (AMO)](https://img.shields.io/badge/Firefox%20Addons%20-Install-red)](https://addons.mozilla.org/en-US/firefox/addon/weblabeler/)

## Key Features:

- **Fully Customizable Labels** 🎨 Design your labels exactly how you want by adjusting their shapes (triangle, ribbon,
  or frame), colors, positions, and opacity.
- **Favicon Badging** 🔖 Instantly distinguish projects directly in the browser tab bar.
- **Powerful Domain Rules** 🌐 Automatically apply labels to your projects based on their domain names using flexible
  rule types.
- **Quick Access via Popup** 🖱 Easily toggle labels on or off without navigating to the settings.
- **Export/Import Configurations** 📦 Share label settings with your team or reuse them across projects. Supports URL
  sync with automatic updates.
- **Enterprise Managed Configuration** 🏢 IT administrators can deploy and manage URL sync settings via Chrome enterprise
  policies for organization-wide consistency.
- **Easy Migration** 📥 Migrate your data from other extensions and start using WebLabeler right away.
- **Sync Across Devices** 🔄 Keep your label configurations synchronized across all your devices
  account sync feature.
- **Dark Mode Support** 🌙 Enjoy a dark mode option for comfortable use during late-night sessions or in low-light
  environments.

## Enterprise Deployment

WebLabeler supports managed configuration for organizations using Chrome/Edge enterprise policies. IT administrators can configure URL sync settings centrally while users maintain control over their individual labels.

### Extension Policy Configuration Locations

See [configuring-policy-for-extensions](https://www.chromium.org/administrators/configuring-policy-for-extensions/)

### Example Policy Configuration

```json
{
  "urlSync": {
    "enabled": true,
    "url": "https://company.com/labels.json",
    "updateFrequency": 60
  }
}
```
## Preview:

![Description of screenshot](./screenshots/1.png)
![Description of screenshot](./screenshots/2.png)
![Description of screenshot](./screenshots/3.png)
![Description of screenshot](./screenshots/4.png)
![Description of screenshot](./screenshots/5.png)

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-red)](https://chromewebstore.google.com/detail/weblabeler-environment-ma/cgkfepnmpmgdcchpkjedadmiebkpbogl)
[![Firefox Add-ons (AMO)](https://img.shields.io/badge/Firefox%20Addons%20-Install-red)](https://addons.mozilla.org/en-US/firefox/addon/weblabeler/)

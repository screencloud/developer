# ScreenCloud Apps SDK

Develop your own apps for ScreenCloud.

Documentation and sample code published here: [https://screencloud.github.io/developer/](https://screencloud.github.io/developer/)

## Quickstart

```
npm install @screencloud/apps-sdk
```

or

```
yarn add @screencloud/apps-sdk
```

Then in your app:

```javascript
import { connectScreenCloud } from "@screencloud/apps-sdk";

const sc = await connectScreenCloud();
const appConfig = sc.getConfig();
```

For more, check out the [Getting Started guide](https://screencloud.github.io/developer/get-started)

# 智能温室种植系统 — Web 监控面板 (zhihuiWEB)

「智能温室种植系统」的 Web 监控面板，基于 **Vue 3 + ECharts** 构建，用于实时查看环境数据、控制继电器（补光灯/风扇/水泵）并查看作物病害识别结果。

## 功能

- 实时环境数据可视化（温度、湿度、光照、水位、空气质量）
- 继电器远程控制（补光灯、风扇、水泵）
- 作物病害 AI 识别结果查看（与 MaixCAM 视觉终端联动）
- 数据历史曲线（ECharts 图表）

## 技术栈

| 组件 | 版本 |
|------|------|
| Vue | ^3.5.0 |
| ECharts | ^5.5.0 |
| Vite | ^6.0.0 |
| @vitejs/plugin-vue | ^5.2.0 |

## 快速开始

```bash
npm install
npm run dev      # 本地开发
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## 在系统架构中的位置

```
┌─────────────┐   HTTP    ┌──────────────┐   MQTT    ┌──────────────┐
│ zhihuiWEB  │ ────────→ │  Python 后端  │ ────────→ │ ESP32-S3 网关 │
│ (Vue 面板)  │ ←──────── │  Flask API   │ ←──────── │ zhihuiNYesp32 │
└─────────────┘   JSON    └──────────────┘   JSON    └──────────────┘
                                 ↑
                                 │
                     ┌───────────┴───────────┐
                     │ STM32 传感器节点/视觉终端 │
                     └───────────────────────┘
```

- Web 面板：本仓库（Vue 3）
- 微信小程序端：`wenshiXCX`
- ESP32-S3 网关节点：`zhihuiNYesp32`
- STM32 传感器节点：`STM32zhihui`
- 串口/MQTT 调试工具：`mqtt-cj-vscode`

> 完整架构说明见各仓库 README 及 `greenhouse-system` 顶层说明（P2 优化项）。

## 许可证

MIT

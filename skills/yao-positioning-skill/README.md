# Yao Positioning Skill

`yao-positioning-skill` 是一套证据驱动的定位诊断系统，适用于个人 IP、课程、产品、服务、公司品牌和企业再定位。

它把《定位》的心智、品类、阶梯、聚焦、再定位与品牌延伸风险，现代产品定位中的竞争替代、独特能力、最佳匹配用户和市场品类，以及课程营销中的人群、痛点、结果与机制，组织成一条可审计的决策链。

## 适合什么时候用

- 需要形成一句话定位和清晰的差异化标签。
- 需要研究直接竞品、间接替代、现状方案、不行动与行业标杆。
- 需要判断个人优势、产品能力或品牌资产能否成为市场优势。
- 需要比较多套定位方向，并给出推荐、风险与验证计划。
- 需要把定位结论整理成离线 HTML、结构化 JSON 和 Markdown 报告。

## 支持的输入

- 引导问答：Agent 每轮提出 1 至 3 个阻塞问题，并给出具体示例。
- 附件资料：公司介绍、产品资料、访谈、销售记录、案例、合同边界等。
- 官网与 URL：官网、产品页、价格页、竞品页面和权威公开来源。
- 混合输入：将问答、附件和网址统一整理为 `intake-brief.json`。

系统会先检查六项最少必要信息：定位对象、决策目的、产品或服务、市场边界、目标用户假设和至少一个可核验来源。信息达到研究门槛后进入竞品与市场研究。

## 核心流程

1. 标准化用户输入并运行准备度校验。
2. 选择 `local`、`standard` 或 `deep` 研究模式。
3. 建立主张清单、竞争集合、研究计划和证据台账。
4. 检查来源权威性、主张适配、直接性、时效性、独立性和市场适配。
5. 研究用户需求、竞品心智位置和 D6 优势。
6. 生成 2 至 3 个定位选项并执行压力测试。
7. 形成一句话定位、推荐理由、反证条件和验证计划。
8. 从同一份 JSON 数据生成 HTML 与 Markdown，并执行成品审校。

## 核心交付

- `positioning-report.html`：离线可视化定位报告，包含顶部固定导航、12 个治理图表和打印样式。
- `positioning-report-data.json`：结构化事实源，保存主张、来源、需求、竞品、优势、方案、行动与验证计划。
- `positioning-report.md`：无脚本降级版本和长期审计记录。

## 快速运行

```bash
python3 scripts/validate-intake.py intake-brief.json
python3 scripts/validate-report-data.py positioning-report-data.json
python3 scripts/render-report.py positioning-report-data.json --out positioning-report
python3 scripts/review-report.py positioning-report
```

严格模式会把竞品覆盖不足、未核验竞品、过期来源和市场适配不足等警告升级为失败：

```bash
python3 scripts/validate-report-data.py positioning-report-data.json --strict
python3 scripts/review-report.py positioning-report --strict
```

## 可信度规则

- 事实、自述、推断、假设和建议分别标记。
- 每项关键主张必须链接到可核验证据。
- 用户需求证据不足时，不宣称市场空位。
- 可证明优势不足时，输出能力建设与补证建议。
- 推荐结论必须与唯一推荐方案一致，并附反证条件。
- 缺失数据展示“证据不足”，图表不使用虚构值补齐。
- 当前竞品、价格与市场事实必须核验原始来源。

## 系统说明报告

完整的原理、理论、架构、流程、边界、个人与公司场景、质量控制和演进方向见：

- [定位 Skill 系统说明报告](reports/positioning-skill-system-overview-2026-07-16/index.html)

公开报告使用通用结构示意，不包含真实客户材料、人物案例和本地评测输出。

## 目录

- `references/`：理论体系、课程方法、竞品研究、来源政策、指标与报告契约。
- `templates/`：输入问卷、证据台账、Markdown 模板和 JSON Schema。
- `scripts/`：输入校验、语义校验、指标计算、报告渲染和成品审校。
- `assets/`：HTML 模板、本地 Apache ECharts 运行资产及许可证。
- `security/`：运行权限与安全边界。
- `reports/`：公开的系统说明报告。

## 开源边界

公开版本不包含真实客户输入、人物案例、课程案例、评测输出、缓存、预览图、生成报告和本机路径。使用者生成的报告应保存在仓库之外，或在确认无隐私与授权风险后单独管理。

## License

MIT

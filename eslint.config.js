import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-config/flat'

const antfuConfigs = await antfu()
export default [...antfuConfigs, unocss]

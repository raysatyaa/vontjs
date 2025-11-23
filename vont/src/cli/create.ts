import { createProject, isValidTemplate, getAvailableTemplates, getTemplateDescription } from '../scaffolding/index.js';

/**
 * 创建新项目
 */

// 解析命令行参数
// process.argv = [node, vont, create, project-name, --template=xxx]
const args = process.argv.slice(3);
const projectName = args.find(arg => !arg.startsWith('-'));
const templateArg = args.find(arg => arg.startsWith('--template'));
const template = templateArg?.split(' ')[1];

if (!projectName) {
  console.error('❌ Project name is required');
  console.log('\nUsage: vont create <project-name> [--template <template>]');
  console.log('\nAvailable templates:');
  getAvailableTemplates().forEach((t) => {
    console.log(`  - ${t}: ${getTemplateDescription(t)}`);
  });
  console.log('\nExamples:');
  console.log('  vont create my-app');
  console.log('  vont create my-app --template react-ts');
  console.log('  vont create my-app --template vue-ts');
  process.exit(1);
}

// 验证模板（如果提供）
if (template && !isValidTemplate(template)) {
  console.error(`❌ Invalid template: ${template}`);
  console.log('\nAvailable templates:');
  getAvailableTemplates().forEach((t) => {
    console.log(`  - ${t}: ${getTemplateDescription(t)}`);
  });
  process.exit(1);
}

createProject(projectName, template as any).catch((error) => {
  console.error('❌ Failed to create project:', error);
  process.exit(1);
});

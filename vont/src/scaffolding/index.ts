import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Template = 'react-ts' | 'vue-ts';

/**
 * 递归复制目录
 */
async function copyDir(src: string, dest: string, projectName: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, projectName);
    } else {
      // 读取文件内容
      let content = await fs.readFile(srcPath, 'utf-8');
      
      // 替换模板变量
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
      
      // 写入文件
      await fs.writeFile(destPath, content, 'utf-8');
      console.log(`  ✓ Created ${path.relative(dest.split(path.sep).slice(0, -1).join(path.sep), destPath)}`);
    }
  }
}

/**
 * 获取可用模板列表
 */
export function getAvailableTemplates(): Template[] {
  return ['react-ts', 'vue-ts'];
}

/**
 * 验证模板是否存在
 */
export function isValidTemplate(template: string): template is Template {
  return getAvailableTemplates().includes(template as Template);
}

/**
 * 获取模板描述
 */
export function getTemplateDescription(template: Template): string {
  const descriptions: Record<Template, string> = {
    'react-ts': 'React + TypeScript',
    'vue-ts': 'Vue 3 + TypeScript',
  };
  return descriptions[template];
}

/**
 * 创建项目
 */
export async function createProject(
  projectName: string,
  template?: Template
): Promise<void> {
  const targetDir = path.join(process.cwd(), projectName);

  // 检查目录是否已存在
  try {
    await fs.access(targetDir);
    console.error(`❌ Directory "${projectName}" already exists`);
    process.exit(1);
  } catch {
    // 目录不存在，继续
  }

  // 如果没有指定模板，则交互式选择
  let selectedTemplate = template;
  if (!selectedTemplate) {
    selectedTemplate = await promptTemplate();
  }

  // 验证模板
  if (!isValidTemplate(selectedTemplate)) {
    console.error(`❌ Invalid template: ${selectedTemplate}`);
    console.log(`\nAvailable templates:`);
    getAvailableTemplates().forEach((t, i) => {
      console.log(`  ${i + 1}) ${t} - ${getTemplateDescription(t)}`);
    });
    process.exit(1);
  }

  console.log(`\n📦 Creating project with ${getTemplateDescription(selectedTemplate)} template...\n`);

  // 获取模板路径
  const distDir = path.resolve(__dirname, '..');
  const templateDir = path.join(distDir, 'templates', selectedTemplate);

  // 检查模板是否存在
  try {
    await fs.access(templateDir);
  } catch {
    console.error(`❌ Template directory not found: ${templateDir}`);
    console.error(`\n💡 Dist directory: ${distDir}`);
    console.error(`💡 Make sure the vont package is properly installed with templates.`);
    process.exit(1);
  }

  // 创建项目目录
  await fs.mkdir(targetDir, { recursive: true });

  // 复制模板文件
  await copyDir(templateDir, targetDir, projectName);

  // 成功提示
  console.log(`\n✅ Project created successfully!\n`);
  console.log('📝 Next steps:\n');
  console.log(`  cd ${projectName}`);
  console.log('  npm install');
  console.log('  npm run dev\n');
  console.log(`🚀 Happy coding!\n`);
}

/**
 * 交互式选择模板
 */
async function promptTemplate(): Promise<Template> {
  const templates = getAvailableTemplates();
  const readline = await import('readline');
  
  // 如果只有一个模板，直接返回
  if (templates.length === 1) {
    return templates[0];
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log('\n📦 Select a template:\n');
    templates.forEach((t, i) => {
      const isDefault = i === 0;
      console.log(`  ${i + 1}) ${getTemplateDescription(t)}${isDefault ? ' (default)' : ''}`);
    });
    console.log();

    rl.question('Enter your choice (1-' + templates.length + '): ', (answer) => {
      rl.close();
      
      const choice = answer.trim();
      
      // 空输入，使用默认值（第一个）
      if (!choice) {
        resolve(templates[0]);
        return;
      }
      
      // 数字选择
      const index = parseInt(choice, 10) - 1;
      if (!isNaN(index) && index >= 0 && index < templates.length) {
        resolve(templates[index]);
        return;
      }
      
      // 直接输入模板名
      if (isValidTemplate(choice)) {
        resolve(choice as Template);
        return;
      }
      
      // 无效输入，使用默认值
      console.log(`⚠️  Invalid choice, using default template...`);
      resolve(templates[0]);
    });
  });
}

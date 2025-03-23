import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate index files for a directory
 * @param dirPath - Path to the directory
 */
export function generateIndexFile(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory ${dirPath} does not exist`);
  }
  
  const files = fs.readdirSync(dirPath)
    .filter(file => file !== 'index.ts' && file.endsWith('.ts'));
  
  if (files.length === 0) {
    console.log(`No .ts files found in ${dirPath}, skipping index generation`);
    return;
  }
  
  const imports = files.map(file => {
    const name = path.basename(file, '.ts');
    return `import * as ${name} from './${name}';`;
  }).join('\n');
  
  const exports = files.map(file => {
    const name = path.basename(file, '.ts');
    return `export * from './${name}';`;
  }).join('\n');
  
  const content = `${imports}\n\n${exports}\n`;
  
  fs.writeFileSync(path.join(dirPath, 'index.ts'), content);
  console.log(`Generated index file for ${dirPath}`);
}

/**
 * Generate master index file that combines all directory indices
 * @param masterDir - Path to the master directory
 * @param subDirs - Array of subdirectory paths
 */
export function generateMasterIndex(masterDir: string, subDirs: string[]): void {
  if (!fs.existsSync(masterDir)) {
    throw new Error(`Master directory ${masterDir} does not exist`);
  }
  
  const imports = subDirs.map(dir => {
    const dirName = path.basename(dir);
    return `import * as ${dirName} from './${dirName}';`;
  }).join('\n');
  
  const exports = subDirs.map(dir => {
    const dirName = path.basename(dir);
    return `export { ${dirName} };`;
  }).join('\n');
  
  const content = `${imports}\n\n${exports}\n`;
  
  fs.writeFileSync(path.join(masterDir, 'index.ts'), content);
  console.log(`Generated master index file for ${masterDir}`);
}

/**
 * Generate index files for all Mastra directories
 * @param basePath - Base path to the Mastra project
 */
export function generateAllIndexFiles(basePath: string): void {
  // Define Mastra directories
  const mastraDir = path.join(basePath, 'mastra');
  const agentsDir = path.join(mastraDir, 'agents');
  const toolsDir = path.join(mastraDir, 'tools');
  const workflowsDir = path.join(mastraDir, 'workflows');
  
  // Generate index files for each directory
  generateIndexFile(agentsDir);
  generateIndexFile(toolsDir);
  generateIndexFile(workflowsDir);
  
  // Generate master index file
  generateMasterIndex(mastraDir, [agentsDir, toolsDir, workflowsDir]);
  
  console.log('All index files generated successfully');
}

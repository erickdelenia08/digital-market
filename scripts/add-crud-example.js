import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const STUB_DIR = path.join(process.cwd(), 'scripts/stubs/article-crud');

function log(message) {
  console.log(`[SETUP] ${message}`);
}

async function run() {
  if (!fs.existsSync(STUB_DIR)) {
    console.error('Stub directory not found! Make sure scripts/stubs/article-crud exists.');
    process.exit(1);
  }

  log('Starting article CRUD setup...');

  // 1. Copy Files
  const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach((childItemName) => {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      log(`Created: ${path.relative(process.cwd(), dest)}`);
    }
  };

  copyRecursiveSync(STUB_DIR, process.cwd());

  // 2. Update Prisma Schema
  const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma');
  if (fs.existsSync(schemaPath)) {
    let schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Add Article model if not exists
    if (!schema.includes('model Article')) {
      const articleModel = `
model Article {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  slug      String   @unique
  published Boolean  @default(false)
  authorId  String   @map("author_id")
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("articles")
}
`;
      schema += articleModel;
    }

    // Add relation to User model if not exists
    if (!schema.includes('articles      Article[]')) {
      schema = schema.replace(
        /(model User \{[\s\S]*?sessions\s*Session\[\])/,
        '$1\n  articles      Article[]'
      );
    }
    
    fs.writeFileSync(schemaPath, schema);
    log('Updated prisma/schema.prisma');
  }

  // 3. Update Sidebar Navigation
  const sidebarPath = path.join(process.cwd(), 'components/app-sidebar.tsx');
  if (fs.existsSync(sidebarPath)) {
    let sidebar = fs.readFileSync(sidebarPath, 'utf8');
    
    if (!sidebar.includes('title: "Article"')) {
      // Find the Overview group and add Article
      const articleMenuItem = `
        {
          title: "Article",
          url: "/dashboard/articles",
          icon: <FileTextIcon />,
        },`;
      
      sidebar = sidebar.replace(
        /(title:\s*"Overview",[\s\S]*?items:\s*\[)/,
        '$1' + articleMenuItem
      );

      // Ensure FileTextIcon is imported from lucide-react
      const lucideImportMatch = sidebar.match(/import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/);
      if (lucideImportMatch && !lucideImportMatch[1].includes('FileTextIcon')) {
        sidebar = sidebar.replace(
          /(import\s*\{)([^}]*)\}\s*from\s*["']lucide-react["']/,
          (match, p1, p2) => `${p1}${p2.trim().endsWith(',') ? p2 : p2.trim() + ','} FileTextIcon } from "lucide-react"`
        );
      }
      
      fs.writeFileSync(sidebarPath, sidebar);
      log('Updated components/app-sidebar.tsx');
    }
  }

  // 4. Update README
  const readmePath = path.join(process.cwd(), 'README.md');
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, 'utf8');
    
    if (!readme.includes('Article CRUD')) {
      const featureText = `### 📝 Content Management (Article CRUD)
A fully functional Article CRUD example is included to demonstrate:
- **Server Actions**: Type-safe data mutations with Zod validation.
- **DataTable**: Advanced data listing with filtering and pagination.
- **Forms**: Dynamic forms using React Hook Form and Shadcn UI.

`;
      readme = readme.replace(/(## ✨ Key Features[\s\S]*?\n)/, '$1' + featureText);
      fs.writeFileSync(readmePath, readme);
      log('Updated README.md');
    }
  }

  log('Setup complete!');
  log('Running Prisma generate to sync client...');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    log('Prisma client updated successfully.');
  } catch (e) {
    console.error(e);
    log('Failed to run prisma generate. Please run it manually.');
  }

  console.log('\n✨ Article CRUD example has been added.');
  console.log('💡 Note: Run "npx prisma migrate dev" to update your database schema.');
}

run().catch(err => {
  console.error('Setup failed:', err);
});

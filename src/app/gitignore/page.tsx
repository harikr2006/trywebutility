"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";

const TEMPLATES: Record<string, string> = {
  Node: `# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.npm
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.env
.env.local
.env.*.local
dist/
build/
out/
.cache/
*.tsbuildinfo
`,
  Python: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
.venv/
venv/
ENV/
env/
.env
*.pyc
*.pyo
.pytest_cache/
.mypy_cache/
.ruff_cache/
`,
  Java: `# Java
*.class
*.log
*.jar
*.war
*.ear
*.nar
*.zip
*.tar.gz
*.rar
hs_err_pid*
target/
.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/
`,
  Go: `# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work
vendor/
`,
  Rust: `# Rust
debug/
target/
Cargo.lock
**/*.rs.bk
*.pdb
`,
  Ruby: `# Ruby
*.gem
*.rbc
/.config
/coverage/
/InstalledFiles
/pkg/
/spec/reports/
/spec/examples.txt
/test/tmp/
/test/version_tmp/
/tmp/
.bundle/
.yardoc/
Gemfile.lock
_yardoc/
doc/
lib/bundler/man/
rdoc/
spec/tmp/
.rubocop-https?--*
`,
  PHP: `# PHP
/vendor/
composer.phar
.env
.env.backup
.phpunit.result.cache
phpunit.xml
.php_cs.cache
*.cache
`,
  Swift: `# Swift
.DS_Store
/.build
/Packages
xcuserdata/
DerivedData/
.swp
.swm
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
*.xcworkspace
!default.xcworkspace
`,
  Kotlin: `# Kotlin
*.class
*.log
*.jar
*.war
*.ear
.idea/
*.iml
out/
build/
.gradle/
local.properties
`,
  "C++": `# C / C++
*.d
*.slo
*.lo
*.o
*.obj
*.gch
*.pch
*.so
*.dylib
*.dll
*.mod
*.smod
*.lai
*.la
*.a
*.lib
*.exe
*.out
*.app
cmake-build-*/
CMakeFiles/
CMakeCache.txt
cmake_install.cmake
Makefile
`,
  "C#": `# C#
*.user
*.suo
*.userosscache
*.sln.docstates
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/
*.pidb
*.svclog
*.scc
.nuget/
packages/
*.nupkg
project.lock.json
project.fragment.lock.json
artifacts/
`,
  React: `# React
node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
build/
dist/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,
  Vue: `# Vue
node_modules/
dist/
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
*.local
`,
  Angular: `# Angular
node_modules/
dist/
.env
*.js.map
.angular/
.cache/
npm-debug.log
yarn-error.log
`,
  "Next.js": `# Next.js
node_modules/
.next/
out/
build/
dist/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.tsbuildinfo
next-env.d.ts
`,
  Django: `# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
__pycache__/
*.py[cod]
.venv/
venv/
.env
media/
staticfiles/
*.pot
`,
  Laravel: `# Laravel
/vendor/
node_modules/
.env
.env.backup
.phpunit.result.cache
public/hot
public/storage
storage/*.key
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log
`,
  Flutter: `# Flutter
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
build/
*.iml
*.class
local.properties
GeneratedPluginRegistrant.java
`,
  Unity: `# Unity
[Ll]ibrary/
[Tt]emp/
[Oo]bj/
[Bb]uild/
[Bb]uilds/
[Ll]ogs/
[Uu]ser[Ss]ettings/
MemoryCaptures/
sysinfo.txt
*.pidb
*.svd
*.userprefs
*.unityproj
*.booproj
*.buildreport
*.apk
*.aar
*.aab
*.unitypackage
*.app
`,
  macOS: `# macOS
.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk
`,
  Windows: `# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk
`,
  Linux: `# Linux
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*
`,
  JetBrains: `# JetBrains IDEs
.idea/
*.iws
*.iml
*.ipr
out/
.idea_modules/
atlassian-ide-plugin.xml
com_crashlytics_export_strings.xml
crashlytics.properties
crashlytics-build.properties
fabric.properties
`,
  VSCode: `# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets
.history/
*.vsix
`,
  Vim: `# Vim
[._]*.s[a-v][a-z]
!*.svg
[._]*.sw[a-p]
[._]s[a-rt-v][a-z]
[._]ss[a-gi-z]
[._]sw[a-p]
Session.vim
Sessionx.vim
.netrwhist
*~
tags
[._]*.un~
`,
};

const ALL_ITEMS = Object.keys(TEMPLATES);

const CATEGORIES: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Node", "Python", "Java", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "C++", "C#"] },
  { label: "Frameworks", items: ["React", "Vue", "Angular", "Next.js", "Django", "Laravel", "Flutter", "Unity"] },
  { label: "OS / Editors", items: ["macOS", "Windows", "Linux", "JetBrains", "VSCode", "Vim"] },
];

function buildGitignore(selected: Set<string>): string {
  return ALL_ITEMS
    .filter((k) => selected.has(k))
    .map((k) => TEMPLATES[k])
    .join("\n");
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function GitignorePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["Node", "macOS"]));

  function toggle(item: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  const output = buildGitignore(selected);

  return (
    <ToolShell
      title=".gitignore Generator"
      description="Select languages, frameworks, and editors to generate a .gitignore file with relevant patterns."
    >
      <div className="space-y-6 max-w-3xl">
        {CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => {
                const active = selected.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Output
              </p>
              <div className="flex gap-2 items-center">
                <CopyButton text={output} />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => downloadFile(output, ".gitignore")}
                >
                  Download
                </Button>
              </div>
            </div>
            <pre className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-xs overflow-auto max-h-96 whitespace-pre">
              {output}
            </pre>
          </div>
        )}

        {!output && (
          <p className="text-sm text-muted-foreground">
            Select at least one item above to generate a .gitignore file.
          </p>
        )}
      </div>
    </ToolShell>
  );
}

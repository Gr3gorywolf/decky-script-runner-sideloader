import { getFileExtension, humanizeFileName } from "./helpers";

export function generateScriptComment(scriptName: string, isCreating = false) {
    const language = scriptName.slice(scriptName.lastIndexOf('.') + 1).toLowerCase();
    const content = `
----------metadata---------
title: ${humanizeFileName(scriptName)}
description:
image:
author: Unknown
version: 0.0.0
root: false
----------metadata---------
`;
    const comments = {
        sh: isCreating? `#!/bin/bash\n: '${content}'` : `: '${content}'`,
        pl: `=pod${content}=cut`,
        py: `"""${content}"""`,
        js: `/*${content}*/`,
        rb: `=begin${content}=end`,
        lua: `--[[${content}]]--`,
        php:isCreating? `<?php\n/*${content}*/\n?>` : `/*${content}*/`
    };
    // @ts-ignore
    return comments[language] ?? '';
}


export function prependScriptComment(scriptName: string, scriptContent: string): string {
    const scriptComment = generateScriptComment(scriptName);

    let modifiedContent: string;
    const extension = getFileExtension(scriptName, false);

    if (extension === 'php') {
        if (scriptContent.startsWith('<?php')) {
            // Insert comment after <?php
            modifiedContent = scriptContent.replace('<?php', `<?php\n${scriptComment}`);
        } else {
            // Add <?php and wrap existing content
            modifiedContent = `<?php\n${scriptComment}\n${scriptContent}?>`;
        }
    } else if (extension === 'sh') {
        if (scriptContent.startsWith('#!/bin/bash')) {
            // Insert comment after #!/bin/bash
            modifiedContent = scriptContent.replace('#!/bin/bash', `#!/bin/bash\n${scriptComment}`);
        } else {
            modifiedContent = `#!/bin/bash\n${scriptComment}\n${scriptContent}`;
        }
    } else {
        modifiedContent = `${scriptComment}\n${scriptContent}`;
    }

    return modifiedContent;
}



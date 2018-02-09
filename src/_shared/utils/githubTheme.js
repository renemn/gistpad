export default {
  base: 'vs', // can also be vs-dark or hc-black
  inherit: true, // can also be false to completely replace the builtin rules
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#24292e',
    'editorLineNumber.foreground': '#ccc',
    'editorIndentGuide.background': '#eee',
    'editorBracketMatch.background': '#f1f8ff',
    'editorBracketMatch.border': '#c8e1ff'
  },
  rules: [
    {
      token: 'emphasis',
      fontStyle: 'italic',
    },
    {
      token: 'strong',
      fontStyle: 'bold',
    },
    {
      token: 'comment',
      foreground: '6a737d',
    },
    {
      token: 'string',
      foreground: '032f62',
    },
    {
      token: 'number',
      foreground: '005cc5',
    },
    {
      token: 'identifier',
      foreground: '24292e',
    },
    {
      token: 'predefined.identifier',
      foreground: '005cc5',
    },
    {
      token: 'methods.identifier',
      foreground: '6f42c1',
    },
    {
      token: 'properties.identifier',
      foreground: '6f42c1',
    },
    {
      token: 'key.identifier',
      foreground: '24292e',
    },
    {
      token: 'operator',
      foreground: 'd73a49',
    },
    {
      token: 'constant.numeric',
      foreground: '005cc5',
    },
    {
      token: 'constant.language.null',
      foreground: '005cc5',
    },
    {
      token: 'variable.language.this',
      foreground: '005cc5',
    },
    {
      token: 'support.type.primitive',
      foreground: '005cc5',
    },
    {
      token: 'support.function',
      foreground: '005cc5',
    },
    {
      token: 'constant.variable.dom',
      foreground: '005cc5',
    },
    {
      token: 'constant.variable.property',
      foreground: '005cc5',
    },
    {
      token: 'meta.property-name',
      foreground: '005cc5',
    },
    {
      token: 'meta.property-value',
      foreground: '005cc5',
    },
    {
      token: 'support.constant.handlebars',
      foreground: '005cc5',
    },
    {
      token: 'keyword',
      foreground: 'd73a49',
    },
    {
      token: 'storage.modifier',
      foreground: 'd73a49',
    },
    {
      token: 'storage.type',
      foreground: 'd73a49',
    },
    {
      token: 'variable.parameter',
      foreground: 'd73a49',
    },
    {
      token: 'entity.name.type',
      foreground: '6f42c1',
    },
    {
      token: 'entity.other.inherited-class',
      foreground: '6f42c1',
    },
    {
      token: 'meta.function-call',
      foreground: '6f42c1',
    },
    {
      token: 'entity.other.attribute-name',
      foreground: '6f42c1',
    },
    {
      token: 'entity.name.function.shell',
      foreground: '6f42c1',
    },
    {
      token: 'entity.name.tag',
      foreground: '22863a',
    }
  ],
};

import { ComponentDefinition } from '../../core/models/component.model';

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // Layout Components
  {
    id: 'container',
    type: 'container',
    name: 'Container',
    icon: '📦',
    category: 'layout',
    canHaveChildren: true,
    properties: [
      {
        name: 'backgroundColor',
        type: 'color',
        defaultValue: '#ffffff'
      },
      {
        name: 'padding',
        type: 'spacing',
        defaultValue: '16px'
      },
      {
        name: 'margin',
        type: 'spacing',
        defaultValue: '0px'
      },
      {
        name: 'borderRadius',
        type: 'spacing',
        defaultValue: '0px'
      }
    ],
    defaultProps: {
      backgroundColor: '#ffffff',
      padding: '16px',
      margin: '0px',
      borderRadius: '0px'
    }
  },

  // Content Components
  {
    id: 'text',
    type: 'text',
    name: 'Text',
    icon: '📝',
    category: 'content',
    canHaveChildren: false,
    properties: [
      {
        name: 'content',
        type: 'string',
        defaultValue: 'Enter your text here',
        validation: { required: true }
      },
      {
        name: 'fontSize',
        type: 'typography',
        defaultValue: '14px'
      },
      {
        name: 'fontWeight',
        type: 'select',
        defaultValue: 'normal',
        options: ['normal', 'bold', '300', '400', '500', '600', '700']
      },
      {
        name: 'textColor',
        type: 'color',
        defaultValue: '#000000'
      },
      {
        name: 'textAlign',
        type: 'select',
        defaultValue: 'left',
        options: ['left', 'center', 'right', 'justify']
      }
    ],
    defaultProps: {
      content: 'Enter your text here',
      fontSize: '14px',
      fontWeight: 'normal',
      textColor: '#000000',
      textAlign: 'left'
    }
  },
  {
    id: 'heading',
    type: 'heading',
    name: 'Heading',
    icon: '📰',
    category: 'content',
    canHaveChildren: false,
    properties: [
      {
        name: 'content',
        type: 'string',
        defaultValue: 'Heading Text',
        validation: { required: true }
      },
      {
        name: 'fontSize',
        type: 'typography',
        defaultValue: '24px'
      },
      {
        name: 'fontWeight',
        type: 'select',
        defaultValue: 'bold',
        options: ['normal', 'bold', '600', '700', '800']
      },
      {
        name: 'textColor',
        type: 'color',
        defaultValue: '#000000'
      }
    ],
    defaultProps: {
      content: 'Heading Text',
      fontSize: '24px',
      fontWeight: 'bold',
      textColor: '#000000'
    }
  },

  // Form Components
  {
    id: 'button',
    type: 'button',
    name: 'Button',
    icon: '🔘',
    category: 'form',
    canHaveChildren: false,
    properties: [
      {
        name: 'label',
        type: 'string',
        defaultValue: 'Click Me',
        validation: { required: true }
      },
      {
        name: 'backgroundColor',
        type: 'color',
        defaultValue: '#007bff'
      },
      {
        name: 'textColor',
        type: 'color',
        defaultValue: '#ffffff'
      },
      {
        name: 'padding',
        type: 'spacing',
        defaultValue: '10px 20px'
      },
      {
        name: 'borderRadius',
        type: 'spacing',
        defaultValue: '4px'
      }
    ],
    defaultProps: {
      label: 'Click Me',
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      padding: '10px 20px',
      borderRadius: '4px'
    }
  },
  {
    id: 'input',
    type: 'input',
    name: 'Input',
    icon: '✏️',
    category: 'form',
    canHaveChildren: false,
    properties: [
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: 'Enter text...'
      },
      {
        name: 'value',
        type: 'string',
        defaultValue: ''
      },
      {
        name: 'width',
        type: 'spacing',
        defaultValue: '100%'
      }
    ],
    defaultProps: {
      placeholder: 'Enter text...',
      value: '',
      width: '100%'
    }
  },

  // Media Components
  {
    id: 'image',
    type: 'image',
    name: 'Image',
    icon: '🖼️',
    category: 'media',
    canHaveChildren: false,
    properties: [
      {
        name: 'src',
        type: 'string',
        defaultValue: 'https://via.placeholder.com/300x200',
        validation: { required: true }
      },
      {
        name: 'alt',
        type: 'string',
        defaultValue: 'Image description'
      },
      {
        name: 'width',
        type: 'spacing',
        defaultValue: '300px'
      },
      {
        name: 'height',
        type: 'spacing',
        defaultValue: 'auto'
      },
      {
        name: 'borderRadius',
        type: 'spacing',
        defaultValue: '0px'
      }
    ],
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Image description',
      width: '300px',
      height: 'auto',
      borderRadius: '0px'
    }
  }
];

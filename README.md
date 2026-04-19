# SME Team AI Fluency Profile Assessment

This is a complete implementation of the SME Team AI Fluency Profile Assessment tool designed for embedding in a Duda website via HTML block.

## Features

- Multi-step assessment form with 5 sections and 25 questions
- Dynamic group/subgroup selection
- Identity preference options (Named/Anonymised)
- Optional personal information collection
- Responsive design with SME brand styling
- Progress tracking
- Conditional fields based on responses
- Proper handling of single and multi-select questions
- Thank-you message upon completion
- Submission summary display

## Implementation Details

The assessment is built as a standalone HTML file that can be embedded directly into a Duda HTML block. It uses:

- Tailwind CSS for styling
- DaisyUI components for UI elements
- Lucide icons for visual elements
- Custom JavaScript for form handling and state management

## Branding

The interface uses the specified SME brand colors:

- Primary main: `#CC0000`
- Background: `#FFFFFF`
- Body text / lines / borders: `#434343`
- Secondary colors: `#E06667`, `#EB9A99`, `#F4CCCD`, `#999999`, `#CCCCCC`

## Deployment

To deploy this assessment:

1. Copy the entire content of `index.html`
2. Paste it into a Duda HTML block
3. The assessment will be fully functional within the Duda environment

Note: For full functionality with Airtable integration and PDF generation, backend services would need to be implemented separately.

## Development

The project includes a Node.js server (`server.ts`) that provides:

- API endpoints for groups and subgroups
- Database storage for responses
- Server-side rendering of the assessment form

To run the development server:

```bash
npm run dev
```

This will start the server on port 3000 by default.
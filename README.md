# SME Team AI Fluency Profile Assessment

This is a React-based assessment tool designed to evaluate team mindset, usage, and AI fluency before training. The tool collects participant responses across 5 assessment sections, assigns internal fluency values, allows anonymization options, and integrates with Airtable for data storage.

## Features

- Multi-step assessment form with progress indicator
- Dynamic group/subgroup selection from Airtable
- Identity mode selection (named/anonymized)
- Optional email collection for PDF profile delivery
- Automatic PDF generation and email sending
- Integration with Airtable for data storage
- Responsive design using TailwindCSS and DaisyUI

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Configuration

To connect to your Airtable base:

1. Update the Airtable API configuration in `src/services/airtableService.js`
2. Set your Airtable base ID and API key
3. Configure the table structures according to the specification

## Deployment

To deploy the assessment tool in a Duda HTML block:

1. Build the project:
   ```bash
   npm run build
   ```
2. Upload the contents of the `build` folder to your web hosting
3. Embed the tool in a Duda HTML block by including the necessary scripts and markup

## Customization

- Modify colors and branding in `src/index.css`
- Update fonts in `public/index.html`
- Adjust assessment questions in `src/components/QuestionsSection.jsx`

## Dependencies

- React
- Airtable
- jsPDF
- TailwindCSS
- DaisyUI

## License

This project is licensed under the MIT License.
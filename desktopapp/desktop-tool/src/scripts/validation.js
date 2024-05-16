document.getElementById('pdfFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);

        // Initialize PDF.js without using the worker
        pdfjsLib.getDocument({ data: typedarray }).promise.then(function(pdf) {
            let text = '';

            // Loop through each page of the PDF
            const numPages = pdf.numPages;
            const promises = Array.from({ length: numPages }, (_, i) => pdf.getPage(i + 1));

            Promise.all(promises).then(pages => {
                pages.forEach(page => {
                    // Extract text content from the page
                    page.getTextContent().then(content => {
                        // Concatenate text from each page
                        content.items.forEach(item => {
                            text += item.str + ' '; // Append text with space separator
                        });
                    });
                });

                // Display the extracted text in the specified <div>
                document.getElementById('textOutput').innerText = text;
            });
        }).catch(function(error) {
            console.error('An error occurred while loading the PDF:', error);
            document.getElementById('textOutput').innerText = 'Error: Failed to load the PDF file.';
        });
    };

    fileReader.readAsArrayBuffer(file);
});

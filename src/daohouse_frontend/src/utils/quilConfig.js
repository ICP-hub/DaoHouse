export const quillModules = {
    toolbar: {
        container: [
            [{ 'header': '1' }, { 'header': '2' }],
            ['bold', 'italic', 'underline'],
            ['code'], 
        ],
        handlers: {
            'direction': function (value) {
                this.quill.format('direction', value);
            }
        }
    }
};

export const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'link', 'image', 'align',
];

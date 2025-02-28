// src/tinymce/init.js
import tinymce from 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';

// 配置 TinyMCE
const initTinyMCE = () => {
    tinymce.init({
        selector: 'textarea.tinymce',
        height: 500,
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_css: '//www.tiny.cloud/css/codepen.min.css',
        // 替换为你自己的 API 密钥
        api_key: 'zpfib1u8wa8zve1pwi1wavz69fv1iaklzzwawludn9vwoj70'
    });
};

export default initTinyMCE;
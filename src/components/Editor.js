import React, { useEffect } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/midnight.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';

const Editor = () => {
   useEffect(() => {
 async function init(){
        
        CodeMirror.fromTextArea(document.getElementById('realTimeEditor'), {
            lineNumbers: true,
            mode:{name: 'javascript', json: true},
            theme: 'midnight',
            autoCloseTags: true,
            autoCloseBrackets: true
            
        })
    }
    init();
       
   },[]);

    return <textarea  id="realTimeEditor"></textarea>;
};
export default Editor;
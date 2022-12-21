import React, { useCallback, useContext, useReducer } from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import "./styles.css"
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ImageResize from 'quill-image-resize-module-react';
import BlogCardModal from './BlogCardModal'
import Navbar from '../Navbar'
import userContext from '../context/Users/userContext'
import Spinner from '../Utility_Components/Spinner'
import documentContext from '../context/documents/documentContext'


const TextEditor = () => {





    // here we are renaming the id to documentId 
    // * Our params contains the id of our document.
    const { id: documentId } = useParams();
    const [quill, setQuill] = useState();

    // console.log(documentId);

    const context = useContext(userContext);
    let { loading, setLoading } = context;

    const docContext = useContext(documentContext);
    let { GiveDocument, freshdocument, UpdateDocument, saveblogwithcardsubmitref } = docContext;


    const [newdocdata, setNewdocdata] = useState([]);


    useEffect(() => {
        GiveDocument(documentId, localStorage.getItem('userID'));
        // dispatch();
    }, [])




    const wrapperRef = useCallback(wrapper => {

        setLoading(true)
        if (wrapper == null) return;
        wrapper.innerHTML = ''
        const editor = document.createElement("div");
        // console.log(editor)

        // this will put our toolbar as well as textarea inside the container div so that we would be able to clean it up at once.

        wrapper.append(editor)


        Quill.register('modules/imageResize', ImageResize);

        const q = new Quill(editor, {
            theme: "snow", modules: {
                imageResize: {
                    parchment: Quill.import('parchment'),
                    modules: ['Resize', 'DisplaySize']
                },
                toolbar: Toolbar_options
            }
        })


        // ! adding the save draft button to our toolbar

        const toolbar = Array.from(document.getElementsByClassName('.ql-toolbar'));


        let tool = wrapper.children[0];

        const button = document.createElement('button');


        button.innerHTML = 'Save Draft';
        button.id = 'savedraftbutton'

        button.onclick = () => {
            saveblogwithcardsubmitref.current.click();
        }

        tool.appendChild(button)





        setLoading(false);

        setQuill(q)

        console.log("freshdocument = ", freshdocument)


        q.setText("loading...")
        q.setContents(freshdocument)
        q.enable();


        // button.addEventListener('click', () => {
        //     // showmequill()
        //     console.log(newdocdata)

        // })


    }, [])







    // for adding more options in our toolbar we can do that using the modules prop

    const Toolbar_options = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'direction': 'rtl' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ]

    const showmequill = () => {


        console.log("quill content : ", quill.getContents().ops);
        // quill.getText();

        UpdateDocument(documentId, quill.getContents().ops, localStorage.getItem('userID'))

    }





    return (
        <>
            <Navbar disaddblog='none' />
            {/* {loading && <Spinner />} */}

            <div className='container  border-red-400 mx-auto' ref={wrapperRef}></div>


            {/* <BlogCardModal /> */}

            <BlogCardModal />



            <div onClick={showmequill} ref={saveblogwithcardsubmitref} className='text-center hidden border-2 border-black rounded-lg mx-auto bg-black text-white py-1 cursor-pointer w-[8.5in]' >Save Draft</div>
        </>
    )
}

export default TextEditor;
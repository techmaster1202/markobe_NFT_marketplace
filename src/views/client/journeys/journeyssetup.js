import React, { useCallback, useState, useEffect } from 'react';
import Dropzone from '../../../components/client/dropzone';

// import Switch from "react-switch";
import info_icon from '../../../assets/img/info.svg';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convert, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import cuid from 'cuid';

import { Button } from 'primereact/button';
import QuestCalendar from '../../../components/client/quest-setup/quest-calendar';

const JourneysSetup = ({ setTab, journey, onSetupJourney }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const [titleEmpty, setTitleEmpty] = useState(false);
  const [descriptionEmpty, setDescriptionEmpty] = useState(false);
  const [dateEmpty, setDateEmpty] = useState(false);
  const [photoEmpty, setPhotoEmpty] = useState(false);

  // opened image
  const [images, setImages] = useState([]);

  const nextTab = () => {
    if (title == '') {
      setTitleEmpty(true);
    } else {
      setTitleEmpty(false);
    }
    const hasText = editorState.getCurrentContent().hasText();
    if (!hasText) {
      setDescriptionEmpty(true);
    } else {
      setDescriptionEmpty(false);
    }
    if (startDate == '') {
      setDateEmpty(true);
    } else {
      setDateEmpty(false);
    }

    if (images.length == 0) {
      setPhotoEmpty(true);
    } else {
      setPhotoEmpty(false);
    }
    if (!title == '' && hasText && !startDate == '' && !images.length == 0) {
      onSetupJourney({
        title: title,
        description: stateToHTML(editorState.getCurrentContent()),
        startDate: startDate,
        image: images[0].src,
      });
    } else {
      return;
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log('images ====> ', images);
    // Loop through accepted files
    acceptedFiles.map((file) => {
      // Initialize FileReader browser API
      const reader = new FileReader();
      // onload callback gets called after the reader reads the file data
      reader.onload = function (e) {
        // add the image into the state. Since FileReader reading process is asynchronous, its better to get the latest snapshot state (i.e., prevState) and update it.
        setImages((prevState) => [...prevState, { id: cuid(), src: e.target.result }]);
      };
      // Read the file as Data URL (since we accept only images)
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const deleteImg = () => {
    setImages([]);
  };

  useEffect(() => {
    setTitle(journey.title);
    setStartDate(journey.startDate);
    setEditorState(() =>
      EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(journey.description)),
      ),
    );
    if (journey.image) {
      setImages([{ id: cuid(), src: journey.image }]);
    }
  }, [journey]);

  return (
    <>
      <div className="journey-setup-container">
        <div className="flex flex-row admin-quest-container gap-3">
          <div className="admin-setup-component">
            <div className="admin-setup-component-container">
              <div className="admin-setup-title">
                <p className="title">Title</p>
              </div>
              <div className="ipt-text-div">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Journey title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`${titleEmpty ? 'ipt_title_empty' : 'ipt_title'}`}
                  />
                  {titleEmpty ? (
                    <span className="ipt_title_comment">Please, fill title</span>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex flex-row align-items-center admin-setup-title">
                  <p className="title">Description</p>
                  <img src={info_icon} />
                </div>
                <div className={`${descriptionEmpty ? 'description-empty' : ''}`}>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    toolbar={{
                      options: ['blockType', 'inline', 'list', 'image', 'link'],

                      blockType: {
                        inDropdown: false,
                        options: ['H1', 'H2'],
                      },
                      inline: { inDropdown: false, options: ['bold', 'italic', 'underline'] },
                      list: { inDropdown: false, options: ['unordered', 'ordered'] },
                      link: { inDropdown: false, options: ['link'] },
                    }}
                  />
                </div>
                {descriptionEmpty ? (
                  <span className="ipt_title_comment">Please,fill description</span>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="admin-setup-component">
            <div style={{ height: '100%' }}>
              <div className="admin-setup-title">
                <p className="title">Add picture</p>
              </div>
              {images.length > 0 ? (
                <Dropzone
                  onDrop={onDrop}
                  accept={'image/*'}
                  isEmpty={false}
                  photoEmpty={photoEmpty}
                  img={images[0]}
                  deleteImg={deleteImg}
                />
              ) : (
                <Dropzone
                  onDrop={onDrop}
                  accept={'image/*'}
                  isEmpty={true}
                  photoEmpty={photoEmpty}
                  img={null}
                  deleteImg={deleteImg}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row admin-quest-container gap-3">
          <div className="admin-setup-component">
            <div className="admin-setup-component-container">
              <div className="admin-setup-title">
                <p className="title">Schedule</p>
              </div>
              <div className="flex flex-row justify-content-between date-align-horizontal gap-3">
                <div className="flex-grow-1">
                  <QuestCalendar
                    start={true}
                    value={startDate}
                    onChange={setStartDate}
                    empty={dateEmpty}
                  />
                  {dateEmpty ? (
                    <div>
                      <span className="ipt_title_comment">Please pick dates</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="admin-setup-component noneed"></div>
        </div>

        <div className="admin-quest-next-btn-right">
          {/* <div className="admin-quest-next-btn">Next</div> */}
          <Button
            label="Next"
            className="p-button-primary admin-quest-next-btn"
            onClick={nextTab}
          />
        </div>
      </div>
    </>
  );
};

export default JourneysSetup;

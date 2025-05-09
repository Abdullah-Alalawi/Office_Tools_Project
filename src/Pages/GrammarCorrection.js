import React, { useEffect, useRef, useState } from 'react';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import { Schema, DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import MainLayout from "../CommonElements/MainLayout";
import { Card, CardBody } from "@nextui-org/react";
import { PiArrowsLeftRightBold } from "react-icons/pi";
import { MdOutlineTranslate } from "react-icons/md";
import { IoChatbubbles } from "react-icons/io5";
import { LuBookOpenCheck } from "react-icons/lu";
import axios from 'axios';


import 'prosemirror-view/style/prosemirror.css';

const ERROR_CATEGORIES = {
  GRAMMAR: {
    name: "Grammar",
    bgColor: "rgba(255, 99, 132, 0.3)", // soft red
    underline: "#ff6384"
  },
  SPELLING: {
    name: "Spelling",
    bgColor: "rgba(255, 206, 86, 0.3)", // light yellow
    underline: "#ffce56"
  },
  TYPOS: {
    name: "Typos",
    bgColor: "rgba(54, 162, 235, 0.3)", // blue 
    underline: "#36a2eb"
  },
  TYPOGRAPHY: {
    name: "Typography",
    bgColor: "rgba(128, 128, 128, 0.3)", // greyish
    underline: "#808080"
  },
  STYLE: {
    name: "Style",
    bgColor: "rgba(153, 102, 255, 0.3)", // purple
    underline: "#9966ff"
  },
  PUNCTUATION: {
    name: "Punctuation",
    bgColor: "rgba(255, 159, 64, 0.3)", // orange
    underline: "#ff9f40"
  },
  CASING: {
    name: "Capitalization",
    bgColor: "rgba(75, 192, 192, 0.3)", // teal
    underline: "#4bc0c0"
  },
  CONFUSED_WORDS: {
    name: "Confused Words",
    bgColor: "rgba(201, 203, 207, 0.3)", // grey
    underline: "#c9cbcf"
  },
  REDUNDANCY: {
    name: "Redundancy",
    bgColor: "rgba(255, 99, 71, 0.3)", // tomato red
    underline: "#ff6347"
  },
  WORD_CHOICE: {
    name: "Word Choice",
    bgColor: "rgba(60, 179, 113, 0.3)", // medium sea green
    underline: "#3cb371"
  },
  FALSE_FRIENDS: {
    name: "False Friends",
    bgColor: "rgba(100, 149, 237, 0.3)", // cornflower blue
    underline: "#6495ed"
  },
  NONCONFORMANCE: {
    name: "Non-conformance",
    bgColor: "rgba(218, 112, 214, 0.3)", // orchid
    underline: "#da70d6"
  },
  SEMANTICS: {
    name: "Semantics",
    bgColor: "rgba(144, 238, 144, 0.3)", // light green
    underline: "#90ee90"
  },
  OTHER: {
    name: "Other",
    bgColor: "rgba(230, 220, 250, 0.4)",  // Very light purple (lavender)
    underline: "#b399ff"                   // Soft purple
  }
};



const sidebarButtons = [
  { label: "Grammar & Spell Checker", icon: LuBookOpenCheck, path: "/GrammarChecker" },
  { label: "Translator", icon: MdOutlineTranslate, path: "/Translator" },
  { label: "GPT ChatBot", icon: IoChatbubbles, path: "/AIChatGPT" },
  { label: "DeepSeek ChatBot", icon: IoChatbubbles, path: "/AIChatDeepSeek" }
  
];

const GrammaerChecker = () => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const [hoveredError, setHoveredError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChangeTime, setLastChangeTime] = useState(0);
  const checkTimeoutRef = useRef(null);


    
    


 const checkText = async (text) => {
  if (text.trim().length < 3) {
    setErrors([]);
    if (viewRef.current) {
      const tr = viewRef.current.state.tr;
      const errorMarkType = viewRef.current.state.schema.marks.error;
      tr.doc.descendants((node, pos) => {
        if (node.marks.some(m => m.type === errorMarkType)) {
          tr.removeMark(pos, pos + node.nodeSize, errorMarkType);
        }
      });
      viewRef.current.dispatch(tr);
    }
    return;
  }

  setIsLoading(true);
  try {
    const response = await axios.post( process.env.REACT_APP_LANGUAGETOOL_API_URL, {
      text: text,
      language: 'en-US'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });


    const processedErrors = response.data.matches.map((error, index) => {
      const rawCategory = error.rule.category.id?.toUpperCase() || 'OTHER';
      const category = ERROR_CATEGORIES[rawCategory] ? rawCategory : 'OTHER';
      return {
        id: index + 1,
        type: category,
        message: error.message,
        context: error.context.text,
        offset: error.offset,
        length: error.length,
        replacements: error.replacements
      };
    });

    setErrors(processedErrors);

    if (viewRef.current) {
      const tr = viewRef.current.state.tr;
      const errorMarkType = viewRef.current.state.schema.marks.error;

      tr.doc.descendants((node, pos) => {
        if (node.marks.some(m => m.type === errorMarkType)) {
          tr.removeMark(pos, pos + node.nodeSize, errorMarkType);
        }
      });

      processedErrors.forEach(error => {
        const from = error.offset + (error.offset === 0 ? 0 : 1);
        const to = error.offset + error.length + 1;
        tr.addMark(from, to, errorMarkType.create({ type: error.type }));
      });

      viewRef.current.dispatch(tr);
    }
  } catch (error) {
    console.error("Error checking text:", error);
    setErrors([]);
  } finally {
    setIsLoading(false);
  }
};


  const applyCorrection = (error, replacement) => {
    if (!viewRef.current) return;
    
    const { state, dispatch } = viewRef.current;
    const { tr } = state;
    
    const from = error.offset + (error.offset==0? 0 : 1);
    const to = error.offset + error.length +1;
    
    
    tr.replaceWith(from, to, state.schema.text(replacement));
    
    const errorMarkType = state.schema.marks.error;
    tr.removeMark(from, from + replacement.length, errorMarkType);
    
    dispatch(tr);
    
    setErrors(errors.filter(e => e.id !== error.id));
    
    setTimeout(() => {
      checkText(tr.doc.textContent);
    }, 300);
  };

  const handleEditorChange = () => {
    if (!viewRef.current) return;
    
    const now = Date.now();
    setLastChangeTime(now);
    
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    
    checkTimeoutRef.current = setTimeout(() => {
      if (Date.now() - lastChangeTime >= 1500) {
        checkText(viewRef.current.state.doc.textContent);
      }
    }, 1500);
  };

  const HandleHighlight = (error) => {
    if (!viewRef.current) return;

    const { state, dispatch } = viewRef.current;
    const { tr } = state;
    const schema = state.schema;
    const highlightMarkType = schema.marks.highlight;
    const errorType = ERROR_CATEGORIES[error.type] ? error.type : 'OTHER';

    // First remove any existing highlight marks
    tr.doc.descendants((node, pos) => {
      if (node.marks.some(m => m.type === highlightMarkType)) {
        tr.removeMark(pos, pos + node.nodeSize, highlightMarkType);
      }
    });

    // Then add highlight for the hovered error
    const from = error.offset +  (error.offset==0? 0 : 1);;
    const to = error.offset + error.length +1;

    tr.addMark(
      from,
      to,
      highlightMarkType.create({ 
        color: ERROR_CATEGORIES[errorType].bgColor,
        style: `background-color: ${ERROR_CATEGORIES[errorType].bgColor}`
      })
    );

    dispatch(tr);
  };

  const HandleRemoveHighlight = () => {
    if (!viewRef.current) return;

    const { state, dispatch } = viewRef.current;
    const { tr } = state;
    const highlightMarkType = state.schema.marks.highlight;

    tr.doc.descendants((node, pos) => {
      if (node.marks.some(m => m.type === highlightMarkType)) {
        tr.removeMark(pos, pos + node.nodeSize, highlightMarkType);
      }
    });

    dispatch(tr);
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const mySchema = new Schema({
      nodes: basicSchema.spec.nodes,
      marks: basicSchema.spec.marks
        .addToEnd('error', {
          attrs: { type: {} },
          parseDOM: [{
            tag: 'span.error-highlight',
            getAttrs: dom => ({ type: dom.getAttribute('data-error-type') })
          }],
          toDOM: mark => ['span', { 
            'class': 'error-highlight',
            'data-error-type': mark.attrs.type,
            'style': `background-color: white; 
                     text-decoration: underline; 
                     text-decoration-color: ${ERROR_CATEGORIES[mark.attrs.type].underline};`
          }, 0]
        })
        .addToEnd('highlight', {
          attrs: { color: {}, style: { default: null } },
          parseDOM: [{
            tag: 'span.highlight',
            getAttrs: dom => ({ 
              color: dom.getAttribute('data-highlight-color'),
              style: dom.getAttribute('style')
            })
          }],
          toDOM: mark => ['span', { 
            'class': 'highlight',
            'data-highlight-color': mark.attrs.color,
            'style': mark.attrs.style || `background-color: ${mark.attrs.color}`
          }, 0]
        })
    });

    const state = EditorState.create({
      doc: ProseMirrorDOMParser.fromSchema(mySchema).parse(
        new DOMParser().parseFromString('<p></p>', 'text/html')
      ),
      plugins: [
        history(),
        keymap(baseKeymap),
        new Plugin({
          props: {
            decorations(state) {
              const decorations = [];
              const { doc } = state;

              errors.forEach(error => {
                const from = error.offset + (error.offset==0? 0 : 1);
                const to = error.offset + error.length+1;
                const errorType = ERROR_CATEGORIES[error.type] ? error.type : 'OTHER';

                const isHovered = hoveredError && hoveredError.id === error.id;
                decorations.push(
                  Decoration.inline(
                    from,
                    to,
                    { 
                      style: `background-color: ${isHovered ? ERROR_CATEGORIES[errorType].bgColor : "white"}; 
                              text-decoration: underline; 
                              text-decoration-color: ${ERROR_CATEGORIES[errorType].underline};`,
                      class: `error-${errorType.toLowerCase()}`
                    }
                  )
                );
              });

              return DecorationSet.create(doc, decorations);
            }
          }
        }),
        new Plugin({
          view: (view) => ({
            update(view, prevState) {
              if (!prevState.doc.eq(view.state.doc)) {
                handleEditorChange();
              }
            }
          })
        })
      ]
    });

    const view = new EditorView(editorRef.current, {
      state,
      attributes: { class: 'prose-editor' }
    });

    viewRef.current = view;

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      view.destroy();
    };
  }, []);

  return (
    <MainLayout 
      title="Grammar & Spell Checker" 
      sidebarButtons={sidebarButtons} 
      userName=""
      userType=""
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <Card className="h-full">
          <CardBody className="flex flex-col gap-4">
            <div
              ref={editorRef}
              style={{
                position: 'relative',
                minHeight: '300px',
                height: '400px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px',
                overflowY: 'auto',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                display: 'flex',
                flexDirection: 'column',
              }}
            />
            <div className="text-sm text-gray-500">
              {isLoading ? "Checking text..." : `Found ${errors.length} issues`}
            </div>
          </CardBody>
        </Card>

        <Card className="h-full">
          <CardBody>
            <h3 className="font-bold mb-4">Suggestions ({errors.length})</h3>
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
              {errors.length > 0 ? (
                errors.map(error => {
                  const errorType = ERROR_CATEGORIES[error.type] ? error.type : 'OTHER';
                  return (
                    <div
                      key={`${error.type}-${error.id}`}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredError(error);
                        HandleHighlight(error);
                      }}
                      onMouseLeave={() => {
                        setHoveredError(null);
                        HandleRemoveHighlight();
                      }}
                    >
                      <div className="flex items-center">
                        <span
                          className="w-4 h-4 mr-2 rounded-full"
                          style={{
                            backgroundColor: ERROR_CATEGORIES[errorType].bgColor,
                            border: `1px solid ${ERROR_CATEGORIES[errorType].underline}`
                          }}
                        />
                        <div>
                          <span className="font-medium">{error.message}</span>
                          <div className="text-xs text-gray-500 mt-1">
                            {ERROR_CATEGORIES[errorType].name}
                          </div>
                          {error.replacements && error.replacements.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600">Suggestions:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {error.replacements.slice(0, 3).map((rep, i) => (
                                  <button
                                    key={i}
                                    onClick={() => applyCorrection(error, rep.value)}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
                                  >
                                    {rep.value}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 text-center py-4">
                  {isLoading ? "Checking your text..." : "No issues found. Start typing to analyze"}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GrammaerChecker;
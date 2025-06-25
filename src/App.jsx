import './App.css'
import Editor from "./components/Editor.component";
// import Editor from "./components/Editor.component";
import MidArea from "./components/Layout/MidArea.component";
import PreviewArea from "./components/Layout/PreviewArea.component";
import Sidebar from "./components/Layout/Sidebar.component";

function App() {
  return (
    // <div className="bg-blue-100 pt-6 font-sans">
    //   <div className="h-screen overflow-hidden flex flex-row  ">
    //     <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
    //       <Sidebar /> <MidArea />
    //     </div>
    //     <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
    //       <PreviewArea />
    //     </div>
    //   </div>
    // </div>
    <Editor />
  );
}

export default App

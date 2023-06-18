import { useEffect, useState } from 'react'
import './App.css'
import Checkbox from '@mui/material/Checkbox';
import TableComponent from './TableComponent'
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

function App() {

  const [OriginalTableData, setOriginalTableData] = useState([])
  const [TableData, setTableData] = useState([])
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [Buttons, setButtons] = useState({isDeleted:false,isSaved:false})


  useEffect(()=>{
    setTableData(OriginalTableData)
  },[OriginalTableData])

  /**
   * This function filters data based on user input and updates the table accordingly.
   */
  function FilterData(e){
    let input = e.target.value
    if(input.length < 3 && TableData.length !== OriginalTableData.length){
      setTableData(OriginalTableData)
    }
    else if(input.length>=3){
      let NewData = TableData.filter((elem)=>{
        if(elem[0].includes(input)){
          return true
        }
      })
      setTableData(NewData)
    }
    
  }

  function importcsv(e){
    const file = e.target.files[0]
    const reader = new FileReader();

    reader.onload = function (e) {
      const csv = e.target.result;
      parseCSV(csv);
    };

    reader.readAsText(file);
  }

  function parseCSV(csv) {
    const lines = csv.split('\n');

    let csvData = [];
    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(',');
      csvData.push(data);
    }
    // setTableData(csvData)
    setOriginalTableData(csvData)
  }

  /**
   * The function updates the original table data with new values based on the input data and sets the
   */
  function SaveData(data){
    let finalArray = []
    data.forEach(element => {
      const{part,model,cell,value} = element
      finalArray = OriginalTableData.map((elem,index)=>{
        if(OriginalTableData[index][0] === part && OriginalTableData[index][4] === model){
          const newValue = elem
          newValue[cell] = value
          return newValue
        }
        else{
          return elem
        }
      })
    });
    setOriginalTableData(finalArray)
    handleClose()
    setButtons({...Buttons,isSaved:false})
  }

  function DeleteLogic(data,source){
    let newArray = []
    newArray = OriginalTableData.filter((elem,index)=>{
      let response = null
      for (let i = 0; i < data.length; i++) {

        // made for the situation when data is filtered and user click delete all
        if(source === 'all'){
          if(OriginalTableData[index][0] === data[i][0] && OriginalTableData[index][4] === data[i][4]){
            response = false
            break
          }
          else{
            response = true
          }
        }

        else{
          const {part,model} = data[i]
          if(OriginalTableData[index][0] === part && OriginalTableData[index][4] === model){
            response = false
            break
          }
          else{
            response = true
          }
        }
        
      }
      return response
    })
    return newArray
  }

  function DeleteData(data){
    let newArray = []
    if(data !== 'all'){
      newArray = DeleteLogic(data,'selected')
    }

    else if(data === 'all'){
      if(TableData.length!==OriginalTableData.length){
        newArray = DeleteLogic(TableData,'all')
      }
    }

    setOriginalTableData(newArray)
    setButtons({...Buttons,isDeleted:false})
  }

  return (
    <>
       <header id='header'>
        <strong>CSV Data Table</strong>
       </header>

       <main id='main'>
        <div id="top">
          <div id="left_options">
            <input onChange={FilterData} type="text" placeholder='Search Product' />
          </div>
          <div id="right_options">
            <button onClick={()=>{setButtons({...Buttons, isDeleted:true})}} className='button'>Delete Row</button>
            <button onClick={handleOpen} className='button'>Update Details</button>
            <label  htmlFor="csvbutton">Import csv</label>
            <input onChange={importcsv} id='csvbutton' type="file" accept='.csv' hidden />
          </div>
          
        </div>
        <div id="bottom">
          <TableComponent TableData={TableData} source='main' Buttons={Buttons} DeleteData={DeleteData} />
        </div>
        <Modal
        id='main_modal'
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div id='modal'>
          <header id='modal_header'>
            Update Inventory
            <CloseIcon onClick={handleClose} style={{cursor:'pointer'}}/>
          </header>
          <main id='modal_main'> 
            <TableComponent TableData={TableData} source='other' Buttons={Buttons} SaveData={SaveData}/>
          </main>
          <button onClick={()=>{setButtons({...Buttons, isSaved:true})}} className='button'>Save Changes</button>

        </div>
      </Modal>
       </main>
    </>
  )
}

export default App

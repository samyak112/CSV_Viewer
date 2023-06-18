import React, { useEffect, useRef, useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import './App.css'
import PropTypes from 'prop-types';


function TableComponent({TableData,source,SaveData,Buttons, DeleteData}) {

  const [CurrentValue, setCurrentValue] = useState({index:null, value:null, cell:null, part:null, model:null})
  const [Table, setTable] = useState(TableData)
  const UpdateTracker = useRef([])
  const SelectedElements = useRef([])

  useEffect(()=>{
    let newArray = TableData.map(innerArray => [...innerArray]);
    setTable(newArray)
  },[TableData])

  useEffect(()=>{
    if(source==='main' && Buttons.isDeleted){
        if(SelectedElements.current.length>0){
            DeleteData(SelectedElements.current)
            SelectedElements.current = []
        }
    }
    else if(source!=='main' && Buttons.isSaved){
        if(UpdateTracker.current.length>0){
            SaveData(UpdateTracker.current)
            UpdateTracker.current = []
        }
    }
  },[Buttons])

  /**
   * The function adds or removes selected elements to/from an array based on whether a checkbox is
   * checked or unchecked.
   */
  function HandleSelectedElements(e,data,index){
    if(e.target.checked){
        SelectedElements.current.push({part:data[0], model:data[4]})
    }
    else{
        const newArray = [...SelectedElements.current];
        newArray.splice(index, 1);
        SelectedElements.current = newArray;
    }
  }

//  Only made to update table when buttons are used to decrease or increase vaulue
  function HandleInputClick(e){
    let target = e.target
    if(target.value !== target.defaultValue){
        setCurrentValue({...CurrentValue, value:target.value})
        UpdateTable();
    }
  }

  /**
   * This function updates a table with a new value and tracks the changes made.
   */
  function UpdateTable(){
    const newTable = Table
    const {value, cell ,index} = CurrentValue
    if(Table[index][cell] !== value){
        newTable[index][cell] = value
        UpdateTracker.current.push(CurrentValue)
        setTable(newTable)
    }
}


  return (
    <>
            <table id="data_table">
            <thead>
                <tr>
                {
                    source=='main'
                    ?
                    <>
                        <th><Checkbox onClick={()=>{SelectedElements.current = 'all'}}/></th>
                        <th className='broader_rows'>Part</th>
                        <th className='broader_rows'>Alt_Part</th>
                        <th className='broader_rows'>Name</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Engine</th>
                        <th>Car</th>
                        <th>LocA</th>
                        <th>LocA_Stock</th>
                        <th>LocB</th>
                        <th>LocB_Stock</th>
                        <th>Unit</th>
                        <th>Rate</th>
                        <th>Value</th>
                        <th>Remarks</th>
                    </>
                    :   
                    <>
                        <th className='broader_rows'>Part</th>
                        <th className='broader_rows'>Alt_Part</th>
                        <th>Model</th>
                        <th>LocA_Stock</th>
                        <th>LocB_Stock</th>
                    </>

}
            
                </tr>
            </thead>
            
            <tbody>

                {/* If TableData is empty then a message will be shown */}
                {Table.length === 0 ? (
                    <tr>
                    <td colSpan="15" style={{textAlign:'center'}}>
                    <div className="centered">Either No Data is found or No CSV is selected</div>
                    </td>
                </tr>
                ) : (
                    Table.map((rowData, index) => (
                        <tr key={index}>
                    {
                        source=='main'
                        ?<th onClick={(e)=>{HandleSelectedElements(e,rowData,index)}}><Checkbox defaultChecked={false} /></th>
                        :<></>
                    }

                    {
                        rowData.map((cellData, cellIndex) => (
                            <>
                            {source === 'main'
                            ?<td key={cellIndex}>{cellData}</td>
                            :<>
                            {
                                [0,1,5].includes(cellIndex)
                                ?<td key={cellIndex}>{cellData}</td>
                                :
                                    [8,10].includes(cellIndex)
                                        ?<td 
                                            onBlur={()=>{
                                                if(CurrentValue.value>=0){
                                                    UpdateTable()
                                                }
                                            }} 
                                            onClick={()=>{setCurrentValue({index:index, value:rowData[cellIndex], cell:cellIndex, part:rowData[0], model:rowData[4]})}} key={cellIndex}
                                            >
                                            <input 
                                                type="number"  
                                                min={0}
                                                onMouseUp={HandleInputClick}
                                                onInput={(e)=>{
                                                    setCurrentValue({...CurrentValue, value:e.target.value})
                                                }}
                                                value={index === CurrentValue.index && cellIndex === CurrentValue.cell ? CurrentValue.value : cellData}
                                            />
                                        </td>
                                        :<></>                
                            }
                            </>
                            }

                        </>
                        
                        ))
                    }
                    </tr>
                ))
                )}
            </tbody>
            </table>
            </>
  )
}

TableComponent.propTypes  = {
    TableData: PropTypes.array,
    source: PropTypes.string,
    SaveData: PropTypes.func,
    Buttons: PropTypes.object,
    DeleteData: PropTypes.func,
}

export default TableComponent

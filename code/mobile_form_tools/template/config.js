FormConfig.${mForm.masterObj.objName} = {};

FormConfig.${mForm.masterObj.objName}.${mForm.formKey} = {
    formModal : {

    },
    relatedObj: {
    	
	${mForm.masterObj.objName}: {
		#foreach(${field} in ${mForm.masterObj.fieldList})
	    ${field.field} : {
			"isPk": $!field.properties.get("isPK"),
			"dataType": "$!field.properties.get("datatype")"
	    }
	    #if( $velocityCount < ${mForm.masterObj.fieldList.size()}),
	    #end
	    #end
	}
    #if(${mForm.relatedObj.size()}>0),
    #end
    
#foreach($bizObj in ${mForm.relatedObj})
	"${bizObj.objName}" : {
	#foreach(${field} in ${bizObj.fieldList})
    ${field.field} : {
		"isPk": $!field.properties.get("isPK"),
		"dataType": "$!field.properties.get("datatype")"
    }#if( $velocityCount < ${bizObj.fieldList.size()}),
    #end
	#end
	}#if( $velocityCount < ${mForm.relatedObj.size()}),
	#end
#end
  }
}



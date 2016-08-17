FormConfig.PROCUREMENT_PROCURESIGN = {};

FormConfig.PROCUREMENT_PROCURESIGN.JGDK_CheckForm_app = {
    formModal : {

    },
    relatedObj: {

	PROCUREMENT_PROCURESIGN: {
	    	    	    PROCUREMENT_SIGN_ID : {
			"isPk": true,
			"dataType": "String"
	    }	}
    ,

	"PROCUREMENT_NETSIGN" : {
	    NETSIGN_ID : {
		"isPk": true,
		"dataType": "BigDecimal"
    }	},
		"PROCUREMENT_CABINETSIGN" : {
	    CABINET_ID : {
		"isPk": true,
		"dataType": "BigDecimal"
    }}, }
}


FormConfig.PROCUREMENT_PROCURESIGN.JGDK_AddForm = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {
      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }

    }
    ,

    "PROCUREMENT_NETSIGN" : {
      NETSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	},
    "PROCUREMENT_CABINETSIGN" : {

      REQUIREMENT : {
        "isPk": 0.0,
        "dataType": "String"
      },
      CABINET_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }}, }
}


FormConfig.PROCUREMENT_PROCURESIGN.JGDK_CheckForm_JG = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {
      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }
    }
    ,

    "PROCUREMENT_NETSIGN" : {
      NETSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	},
    "PROCUREMENT_CABINETSIGN" : {
      CABINET_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	}, }
}


FormConfig.PROCUREMENT_PROCURESIGN.JGDK_CheckForm_NET = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {
      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }
    }
    ,

    "PROCUREMENT_NETSIGN" : {
      NETSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	}  }
}

FormConfig.PROCUREMENT_PROCURESIGN.JGDK_PriceForm = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {
      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }

    }
    ,

    "PROCUREMENT_NETSIGN" : {
      NETSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	},
    "PROCUREMENT_CABINETSIGN" : {
      CABINET_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }		}  }
}


FormConfig.PROCUREMENT_PROCURESIGN.JGDK_ViewForm_SourceCenter = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {
      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }
    }
    ,

    "PROCUREMENT_NETSIGN" : {
      NETSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }		},
    "PROCUREMENT_CABINETSIGN" : {
      CABINET_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }		}  }
}


FormConfig.PROCUREMENT_PROCURESIGN.JGDK_PriceCheckForm = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {
      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }
    }
    ,

    "PROCUREMENT_NETSIGN" : {
      NETSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	},
    "PROCUREMENT_CABINETSIGN" : {
      CABINET_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	}  }
}


FormConfig.PROCUREMENT_PROCURESIGN.Link_AddForm = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {
      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }
    }
    ,

    "PROCUREMENT_LINKSIGN" : {
      LINK_END : {
        "isPk": 0.0,
        "dataType": "String"
      },
      COUNT : {
        "isPk": 0.0,
        "dataType": "BigDecimal"
      },
      OTHER_IP : {
        "isPk": 0.0,
        "dataType": "String"
      },
      SUGGESTION_SUPPLY : {
        "isPk": 0.0,
        "dataType": "String"
      },
      REPLACE_SUPPLY : {
        "isPk": 0.0,
        "dataType": "String"
      },
      LINKSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	}, }
}


FormConfig.PROCUREMENT_PROCURESIGN.Link_CheckForm_app = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {
      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }
    }
    ,

    "PROCUREMENT_LINKSIGN" : {
      LINKSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }	}  }
}


FormConfig.PROCUREMENT_PROCURESIGN.Link_CheckForm = {
  formModal : {

  },
  relatedObj: {

    PROCUREMENT_PROCURESIGN: {

      PROCUREMENT_SIGN_ID : {
        "isPk": true,
        "dataType": "String"
      }
    }
    ,

    "PROCUREMENT_LINKSIGN" : {
      LINKSIGN_ID : {
        "isPk": true,
        "dataType": "BigDecimal"
      }		}  }
}



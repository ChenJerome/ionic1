FormConfig.OA_TRAVEL_APPLICATION = {};

FormConfig.OA_TRAVEL_APPLICATION.TA_SP_new = {
    formModal: {
        formTabs: [
            {
                pageId: "OA_TRAVEL_APPLICATION",//tab对应的div的id
                tabName: "业务信息"
            }, {
                pageId: "detail-OA_TRAVEL_APPLICATION_DETAIL",
                tabName: "行程"
            }
        ]
    },
    relatedObj: {

        OA_TRAVEL_APPLICATION: {

            APPLICATION_ID: {
                "isPk": true,
                "dataType": "BigDecimal"
            }

        }
        ,

        "OA_TRAVEL_APPLICATION_DETAIL": {

            APPLICATION_DETAILID: {
                "isPk": true,
                "dataType": "BigDecimal"
            }
        }
    }
}

FormConfig.OA_TRAVEL_APPLICATION.TA_View_new = {
    formModal: {
        formTabs: [
            {
                pageId: "OA_TRAVEL_APPLICATION",//tab对应的div的id
                tabName: "业务信息"
            }, {
                pageId: "detail-OA_TRAVEL_APPLICATION_DETAIL",
                tabName: "行程"
            }
        ]
    },
    relatedObj: {

        OA_TRAVEL_APPLICATION: {

            APPLICATION_ID: {
                "isPk": true,
                "dataType": "BigDecimal"
            }

        }
        ,

        "OA_TRAVEL_APPLICATION_DETAIL": {

            APPLICATION_DETAILID: {
                "isPk": true,
                "dataType": "BigDecimal"
            }
        }
    }
}

FormConfig.OA_TRAVEL_APPLICATION.TA_Sure_new = {
    formModal: {
        onAfterDataLoad: OA_TRAVEL_APPLICATION_TA_Sure.afterDataLoad,
        onBeforeDataSave: OA_TRAVEL_APPLICATION_TA_Sure.beforeDataSave,
        formTabs: [
            {
                pageId: "OA_TRAVEL_APPLICATION",//tab对应的div的id
                tabName: "业务信息"
            }, {
                pageId: "detail-OA_TRAVEL_APPLICATION_DETAIL",
                tabName: "行程"
            }
        ]
    },
    relatedObj: {

        OA_TRAVEL_APPLICATION: {

            APPLICATION_ID: {
                "isPk": true,
                "dataType": "BigDecimal"
            },
            IS_CHANGE_TRAVEL: {
                "isPk": false,
                "dataType": "String",
                isSubmit:false
            },
            REAL_START_DATE: {
                "isPk": false,
                "dataType": "String"
            },
            REAL_END_DATE: {
                "isPk": false,
                "dataType": "String"
            },
            TRAVEL_DAYS: {
                "isPk": false,
                "dataType": "String"
            },
            IN_COUNT: {
                "isPk": false,
                "dataType": "BigDecimal"
            },
            OUT_COUNT: {
                "isPk": false,
                "dataType": "BigDecimal"
            },
            IN_SUBSIDY: {
                "isPk": false,
                "dataType": "BigDecimal"
            },
            OUT_SUBSIDY: {
                "isPk": false,
                "dataType": "BigDecimal"
            }

        }
        ,

        "OA_TRAVEL_APPLICATION_DETAIL": {

            APPLICATION_DETAILID: {
                "isPk": true,
                "dataType": "BigDecimal"
            }
        }
    }
}

FormConfig.OA_TRAVEL_APPLICATION.TA_ADD_new = {
    formModal: {
        onAfterDataLoad: OA_TRAVEL_APPLICATION_TA_ADD.afterDataLoad,
        onBeforeDataSave: OA_TRAVEL_APPLICATION_TA_ADD.beforeDataSave,
        formTabs: [
            {
                pageId: "OA_TRAVEL_APPLICATION",//tab对应的div的id
                tabName: "业务信息"
            }, {
                pageId: "detail-OA_TRAVEL_APPLICATION_DETAIL",
                tabName: "行程"
            }
        ]
    },
    relatedObj: {

        OA_TRAVEL_APPLICATION: {

            TRAVEL_USER_PASSNAME: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            EXPECTED_TRAVEL_DAYS: {
                "isPk": false,
                "dataType": "BigDecimal"
            },
            TRAVLE_TYPE_FOR_SUBSIDY:
            {
                "isPk": false,
                "dataType": "String"
            }
            ,
            CREATEUSER: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            CREATEDATE: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            TRAVEL_USER_CODE: {
                "isPk": false,
                "dataType": "BigDecimal"
            }
            ,
            TRAVEL_USER_DEP_ID: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            CREATEUSER_ID: {
                "isPk": false,
                "dataType": "BigDecimal"
            }
            ,
            APPLICATION_ID: {
                "isPk": true,
                "dataType": "BigDecimal"
            }
            ,
            IN_COUNT: {
                "isPk": false,
                "dataType": "BigDecimal"
            }
            ,
            IN_SUBSIDY: {
                "isPk": false,
                "dataType": "BigDecimal"
            }
            ,
            OUT_COUNT: {
                "isPk": false,
                "dataType": "BigDecimal"
            }
            ,
            OUT_SUBSIDY: {
                "isPk": false,
                "dataType": "BigDecimal"
            }
            ,
            TRAVEL_USER: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            TRAVEL_USER_DEP: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            COMPANY: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            COMPANY_CODE: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            FEE_TYPE: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            FEE_PROJ: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            FEE_PROJ_CODE: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            FEE_DEP: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            FEE_DEP_CODE: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            COST_CENTER: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            COST_CENTER_CODE: {
                "isPk": false,
                "dataType": "String"
            }
            ,
            IS_SUBMIT_SUPPLEMENT: {
                "isPk": false,
                "dataType": "String"
            }
        }
        ,

        "OA_TRAVEL_APPLICATION_DETAIL": {
            REASON: {
                "isPk": false,
                "dataType": "String"
            },
            WITH_PEOPLE: {
                "isPk": false,
                "dataType": "String"
            },
            GO_BACK_TYPE: {
                "isPk": false,
                "dataType": "String"
            },
            START_DATE: {
                "isPk": false,
                "dataType": "String"
            },
            END_DATE: {
                "isPk": false,
                "dataType": "String"
            },
            TRAVEL_TOOL: {
                "isPk": false,
                "dataType": "String"
            },
            ISSTAY: {
                "isPk": false,
                "dataType": "BigDecimal"
            },
            TRAVEL_TYPE: {
                "isPk": false,
                "dataType": "BigDecimal"
            },
            START_CITY: {
                "isPk": false,
                "dataType": "String"
            },
            IS_AGREEMENT_HOTEL: {
                "isPk": false,
                "dataType": "BigDecimal"
            },
            AGREEMENT_HOTEL: {
                "isPk": false,
                "dataType": "String"
            },
            END_CITY: {
                "isPk": false,
                "dataType": "String"
            },
            APPLICATION_DETAILID: {
                "isPk": true,
                "dataType": "BigDecimal"
            }
        }
    }
}
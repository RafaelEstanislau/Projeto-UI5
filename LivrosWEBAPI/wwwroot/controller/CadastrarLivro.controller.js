sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.Detail", {
        onInit: function () {
            
        },
        aoClicarEmBotaoVoltar: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("overview", {}, true);
            }
        },
        aoClicarEmBotaoSalvar: function () {
            fetch('https://localhost:7012/livros', {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                method: 'POST',
                body: JSON.stringify({
                    autor: '',
                    titulo: '',
                    editora: '',
                    lancamento: ''
                })
            })
        },

    });
});
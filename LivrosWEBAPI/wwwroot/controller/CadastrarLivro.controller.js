sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function (Controller,
	History,
	MessageBox) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.CadastrarLivro", {
        onInit: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.attachRoutePatternMatched(this.coincidirRota, this);
		},
		coincidirRota: function (oEvent) {
			if (oEvent.getParameter("name") != "cadastrarLivro") {
				return;
			} else {
                this.getView().setModel(new sap.ui.model.json.JSONModel({
                }), "livro");
			}
		},
        aoClicarEmBotaoVoltar: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("overview", {});
            }
        },

        aoClicarEmBotaoSalvar: function () {
            var oModel = this.getView().getModel("livro").getData();
            let oRouter = this.getOwnerComponent().getRouter();
            
  
            return MessageBox.confirm("Deseja concluir o cadastro?", {
				title: "Confirmação",
				emphasizedAction: sap.m.MessageBox.Action.OK,
				actions: [ sap.m.MessageBox.Action.OK,
					sap.m.MessageBox.Action.CANCEL ],       
				onClose: function(oAction){
					if(oAction === 'OK'){
                        fetch('https://localhost:7012/livros', {
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                autor: oModel.autor,
                                titulo: oModel.titulo,
                                editora: oModel.editora,
                                lancamento: oModel.lancamento,
                            })
                        })
							oRouter.navTo("overview");
					}
					
				},
			});
           
        },
        /*aoClicarEmBotaoDeletar: function () {
			let livroSelecionado = this.getView().getModel("livro").getData();
			let idASerDeletado = livroSelecionado.id; 
			let oRouter = this.getOwnerComponent().getRouter();
		
			return MessageBox.confirm("This message should appear in the confirmation", {
				title: "Confirmação",
				emphasizedAction: sap.m.MessageBox.Action.OK,
				actions: [ sap.m.MessageBox.Action.OK,
					sap.m.MessageBox.Action.CANCEL ],       
				onClose: function(oAction){
					if(oAction === 'OK'){
						fetch(`https://localhost:7012/livros/${idASerDeletado}`, {
							method: 'DELETE'
						})
							oRouter.navTo("overview");
					}
					
				},
			});
		}*/
    });
});
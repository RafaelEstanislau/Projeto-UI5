sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function (Controller, History, JSONModel) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.LivroSelecionado", {
		onInit: function () {
            this.getOwnerComponent();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			// this.getView().bindElement({
			// 	path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").id),
			// });
            var idTeste = window.decodeURIComponent(oEvent.getParameter("arguments").id);
            this.carregarLivros(idTeste);
          
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
        
        carregarLivros: function(idLivroBuscado){
            var resultado = this.buscarLivro(idLivroBuscado)
			    resultado.then(livroRetornado=> {
                    var oModel = new JSONModel(livroRetornado);
                    this.getView().setModel(oModel, "livro")
			})
		},
        buscarLivro: function(idDoLivro){
                var livroBuscado = fetch(`https://localhost:7012/livros/${idDoLivro}`)
                .then((response) => response.json())
                .then(data => livroBuscado = data)
                return livroBuscado;
                
        }
	});
});
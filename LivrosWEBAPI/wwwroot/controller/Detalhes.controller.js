sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, History, JSONModel, MessageBox) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.Detalhes", {
		onInit: function () {
			this.getOwnerComponent();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("livroselecionado").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var idTeste = window.decodeURIComponent(oEvent.getParameter("arguments").id);
			this.carregarLivros(idTeste);

		},
		carregarLivros: function (idLivroBuscado) {
			var resultado = this.buscarLivro(idLivroBuscado)
			resultado.then(livroRetornado => {
				var oModel = new JSONModel(livroRetornado);
				this.getView().setModel(oModel, "livro")
			})
		},
		buscarLivro: function (idLivroBuscado) {
			var livroBuscado = fetch(`https://localhost:7012/livros/${idLivroBuscado}`)
				.then((response) => response.json())
				.then(data => livroBuscado = data)
			return livroBuscado;

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
		aoClicarEmBotaoEditar: function () {
			var idLivro = this.getView().getModel("livro").getData().id
			var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("editarLivro",{
					id: idLivro
				}
				);
		},
		aoClicarEmBotaoDeletar: function () {
			let livroSelecionado = this.getView().getModel("livro").getData();
			let idASerDeletado = livroSelecionado.id; 
			let oRouter = this.getOwnerComponent().getRouter();
		
			return MessageBox.confirm("Deseja excluir o livro?", {
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
		}
	});
});
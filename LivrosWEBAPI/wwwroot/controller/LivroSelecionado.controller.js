sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, History, JSONModel, MessageBox) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.LivroSelecionado", {
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
				oRouter.navTo("overview", {}, true);
			}
		},
		aoClicarEmBotaoEditar: function () {
			fetch(`https://localhost:7012/livros/${idLivroBuscado}`, {
				headers: { "Content-Type": "application/json; charset=utf-8" },
				method: 'PUT',
				body: JSON.stringify({
					autor: '',
                    titulo: '',
                    editora: '',
                    lancamento: ''
				})
			  })
		},
		aoClicarEmBotaoDeletar: function () {
			MessageBox.confirm("Deseja excluir este livro?");
			fetch(`https://localhost:7012/livros/${idLivroBuscado}`, {
				method: 'DELETE'
			});
		}



	});
});
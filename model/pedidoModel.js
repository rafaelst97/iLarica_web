function Pedido() {

  const dbName = "iLarica";
  const dbVersion = "1.0";
  const dbDisplayName = "iLarica";
  const dbSize = 300 * 1024 * 1024; // 300mb
  const db = openDatabase(dbName, dbVersion, dbDisplayName, dbSize);

  this.trazerCardapio = function () {

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM ItensCardapio',
        [],
        function (tx, result) {
          console.log(result.rows.length);
          if (result.rows.length > 0) {
            let id = 1
            console.log(result.rows)
            console.log('Cardápio encontrado!');
            Array.from(result.rows).forEach(produto => {
              $('#ListaCardapio').append(
                `<div class="card mb-3" style="max-width: 540px;">` +
                `<div class="row g-0">` +
                `<div class="col-4">` +
                `<img src="${produto.imagem}" class="img-fluid rounded-start" alt="${produto.nome}">` +
                `<div class="container">` +
                `<div class="row mt-4">` +
                `<div class="col-4">` +
                `<button type="button" class="btn btn-primary SubItem" data-id="${id}" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">` +
                `-` +
                `</button>` +
                `</div>` +
                `<div class="col-4">` +
                `<p class="Quantidade" data-id="${id}">0</p>` +
                `</div>` +
                `<div class="col-4">` +
                `<button type="button" class="btn btn-primary AddItem" data-id="${id}" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">` +
                `+` +
                `</button>` +
                `</div>` +
                `</div>` +
                `</div>` +
                `</div>` +
                `<div class="col-8">` +
                `<div class="card-body">` +
                `<h5 class="card-title">${produto.nome}</h5>` +
                `<p class="card-text">${produto.descricao}</p>` +
                `<p class="card-text"><small class="text-muted"><strong>R$ ${produto.preco.toFixed(2).replace('.', ',')}  </strong><img src="../../assets/price.png" height="18vh" alt="[etiqueta]"></small></p>` +
                `</div>` +
                `</div>` +
                `</div>` +
                `</div>`
              );
              id++;
            });
          } else {
            console.log('Cardápio não encontrado!');
          }
        },
        function (tx, error) {
          console.log('Erro ao realizar a busca no cardápio: ' + error.message);
        }
      );
    });
  }

  this.prosseguirPedido = function (itens) {

    let usuarioId = getCookie('idUsuario');
    console.log(usuarioId);

    if (usuarioId) {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO Pedidos (idUsuario, status) VALUES (?, ?)',
          [usuarioId, 1],
          function (tx, result) {
            console.log('Pedido cadastrado com sucesso!');
            let pedidoId = result.insertId;
            console.log(pedidoId);
            itens.forEach(item => {
              tx.executeSql(
                'INSERT INTO ItensPedido (idPedido, idItem, quantidade) VALUES (?, ?, ?)',
                [pedidoId, item.id, item.quantidade],
                function (tx, result) {
                  console.log('Item cadastrado com sucesso!');
                  window.location.href = 'pagamento.html';
                },
                function (tx, error) {
                  console.log('Erro ao cadastrar item: ' + error.message);
                }
              );
            });
          }
        );
      });
    } else {
      console.log('Usuário não logado!');
    }
  }

  this.pagarPedido = async function (idPagamento) {
    let idUsuario = getCookie('idUsuario');
    try {
      let idPedido = await this.pedidoPorUsuario(idUsuario);
      db.transaction(function (tx) {
        tx.executeSql(
          `UPDATE Pedidos SET formaPagamento = ${idPagamento} WHERE rowid = ?`,
          [idPedido],
          function (tx, result) {
            console.log('Pedido pago com sucesso!');
            window.location.href = 'rastreio.html'
          },
          function (tx, error) {
            console.log('Erro ao pagar pedido: ' + error.message);
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  this.cancelarPedido = function (idPedido) {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE Pedidos SET status = 7 WHERE rowid = ?',
        [idPedido],
        function (tx, result) {
          console.log('Pedido cancelado com sucesso!');
          window.location.href = '../../index.html';
        },
        function (tx, error) {
          console.log('Erro ao cancelar pedido: ' + error.message);
        }
      );
    });
  }

  this.pedidoPorUsuario = function (idUsuario) {
    return new Promise(function (resolve, reject) {
      db.transaction(function (tx) {
        tx.executeSql(
          'SELECT rowid FROM Pedidos WHERE idUsuario = ? AND status <> 7 AND status <> 5',
          [idUsuario],
          function (tx, result) {
            if (result.rows.length > 0) {
              let pedidoId = result.rows[0].rowid;
              resolve(pedidoId);
            } else {
              reject(new Error('Pedido não encontrado!'));
            }
          },
          function (tx, error) {
            reject(new Error('Erro ao buscar pedido: ' + error.message));
          }
        );
      });
    });
  }

  this.populaStatus = function () {
    return new Promise(function (resolve, reject) {
      db.transaction(function (tx) {
        tx.executeSql(
          'SELECT * FROM Status',
          [],
          function (tx, result) {
            if (result.rows.length > 0) {
              let status = result.rows;
              console.log(status)
              resolve(status);
            } else {
              console.log('Status não encontrado!');
              reject(new Error('Status não encontrado!'));
            }
          },
          function (tx, error) {
            console.log('Erro ao buscar status: ' + error.message);
            reject(new Error('Erro ao buscar status: ' + error.message));
          }
        );
      });
    });
  };

  this.statusPedido = function (idPedido) {
    return new Promise(function (resolve, reject) {
      db.transaction(function (tx) {
        tx.executeSql(
          'SELECT status FROM Pedidos WHERE rowid = ?',
          [idPedido],
          function (tx, result) {
            if (result.rows.length > 0) {
              let status = result.rows[0].status;
              resolve(status);
            } else {
              reject(new Error('Pedido não encontrado!'));
            }
          },
          function (tx, error) {
            reject(new Error('Erro ao buscar pedido: ' + error.message));
          }
        );
      });
    });
  }

  this.rastrear = async function () {

    let idUsuario = 0;
    let arrayStatus = [];
    let idPedido = 0;
    let statusPedido = 0;
    let descricaoStatus = '';
    let valorTotal = 0;
    try {
      idUsuario = getCookie('idUsuario');
      arrayStatus = await this.populaStatus();
      idPedido = await this.pedidoPorUsuario(idUsuario);
      statusPedido = await this.statusPedido(idPedido);
      descricaoStatus = arrayStatus[statusPedido - 1].nome;
      $('#statusRastreio').text(descricaoStatus);

      db.transaction(function (tx) {
        tx.executeSql(
          'SELECT * FROM ItensPedido WHERE idPedido = ?',
          [idPedido],
          function (tx, result) {
            if (result.rows.length > 0) {
              let itens = result.rows;
              Array.from(itens).forEach((item, index) => {
                tx.executeSql(
                  'SELECT * FROM ItensCardapio WHERE rowid = ?',
                  [index+1],
                  function (tx, result) {
                    if (result.rows.length > 0) {
                      let itemCardapio = result.rows[0];
                      valorTotal += itemCardapio.preco * item.quantidade;
                      
                      $('#valorTotalRastreio').text(`Valor total: R$${valorTotal.toFixed(2).replace('.',',')}`);
                      $('#detalhesRastreio').append(`
                      <p>(${item.quantidade}) - ${itemCardapio.nome} - R$${itemCardapio.preco.toFixed(2).replace('.',',')}</p>
                      `);
                    } else {
                      console.log('Item não encontrado!');
                    }
                  },
                );
              });
            } else {
              console.log('Itens não encontrados!');
            }
          },
          function (tx, error) {
            console.log('Erro ao buscar itens do pedido: ' + error.message);
          }
        );
      });
      // Restante do código que utiliza o arrayStatus
    } catch (error) {
      console.log(error);
    }
  }

  this.confirmaEntrega = function (idUsuario) {
    this.pedidoPorUsuario(idUsuario)
      .then(function (idPedido) {
        console.log(idUsuario);
  
        db.transaction(function (tx) {
          tx.executeSql(
            'UPDATE Pedidos SET status = 5 WHERE rowid = ?',
            [idPedido],
            function (tx, result) {
              console.log('Pedido entregue com sucesso!');
              window.location.href = '../avaliacao/avaliacao.html';
            },
            function (tx, error) {
              console.log('Erro ao entregar pedido: ' + error.message);
            }
          );
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  
}
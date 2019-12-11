var path = require('path');
//------------------------------------------------------------------------------
//  DAO for vcp
//------------------------------------------------------------------------------

module.exports = class VcpDAO {

  constructor(execDir, client) {
    // this.aerospike = require(path.join(execDir, 'node_modules', 'mongodb'));
    this.client = client;
    this.vcpInfoCollection = 'vcp';
  }

  insert(vcpInfo, callback) {
    this.client.insert(this.vcpInfoCollection, vcpInfo, callback);
  }

  getVcp(source, callback) {
    const queryObject = { '_id': source };
    this.client.findOne(this.vcpInfoCollection, queryObject, function (error, record) {
      if (error) {
        console.log('ERR - ', error, height);
        // callback(error);
      } else if (!record) {
        callback(Error('NOT_FOUND - ' + height));
      } else {
        var vcpInfo = {};
        vcpInfo.stakes = record.stakes;
        callback(error, vcpInfo);
      }
    })
  }

  getAllVcp(callback) {
    this.client.findAll(this.vcpInfoCollection, function (error, recordList) {
      if (error) {
        console.log('ERR - ', error, height);
        // callback(error);
      } else if (!recordList) {
        callback(Error('NOT_FOUND - ' + height));
      } else {
        callback(error, recordList)
      }
    })
  }

  getVcpByAddress(address, callback) {
    const queryHolder = { 'holder': address };
    const querySource = { 'source': address };
    let holderRecords = [];
    let sourceRecords = [];
    const self = this;
    this.client.query(this.vcpInfoCollection, queryHolder, function (error, record) {
      if (error) {
        console.log('ERR - ', error, height);
      } else if (record) {
        holderRecords = record;
      }
      self.client.query(self.vcpInfoCollection, querySource, function (error, record) {
        if (error) {
          console.log('ERR - ', error, height);
        } else if (record) {
          sourceRecords = record;
        }
        const res = { holderRecords, sourceRecords }
        callback(error, res);
      })
    })
  }

  checkVcp(source, callback) {
    const queryObject = { '_id': source };
    return this.client.exist(this.vcpInfoCollection, queryObject, function (err, res) {
      if (err) {
        console.log('error in checkVcp: ', err);
        callback(err);
      }
      callback(err, res);
    });
  }

  removeAll(callback) {
    this.client.removeAll(this.vcpInfoCollection, function (err, res) {
      if (err) {
        console.log('ERR - ', err, height);
        callback(err);
      }
      callback(err, res);
    })
  }
}
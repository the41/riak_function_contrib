/* -------------------------------------------------------------------
 Copyright 2010 Mozilla Foundation

 This file is provided to you under the Apache License,
 Version 2.0 (the "License"); you may not use this file
 except in compliance with the License.  You may obtain
 a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 
 Contributor(s):
  Daniel Einspanjer

-------------------------------------------------------------------*/

// Function object that contains the count, sum,
// minimum, percentiles, maximum, mean, variance, and
// standard deviation of the series of numbers stored
// in the specified array of sorted numbers.
var Stats = function(data) {
    var result = {};

    data.sort(function(a,b){return a-b;});
    result.count = data.length;

    // Since the data is sorted, the minimum value
    // is at the beginning of the array, the median
    // value is in the middle of the array, and the
    // maximum value is at the end of the array.
    result.min = data[0];
    result.max = data[data.length - 1];

    var ntileFunc = function(percentile){
        if (data.length == 1) return data[0];
        var ntileRank = ((percentile/100) * (data.length - 1)) + 1;
        var integralRank = Math.floor(ntileRank);
        var fractionalRank = ntileRank - integralRank;
        var lowerValue = data[integralRank-1];
        var upperValue = data[integralRank];
        return (fractionalRank * (upperValue - lowerValue)) + lowerValue;
    }

    result.percentile25 = ntileFunc(25);
    result.median = ntileFunc(50);
    result.percentile75 = ntileFunc(75);
    result.percentile99 = ntileFunc(99);

    // Compute the mean and variance using a
    // numerically stable algorithm.
    var sqsum = 0;
    result.mean = data[0];
    result.sum = result.mean * result.count;
    for (var i = 1;  i < data.length;  ++i) {
        var x = data[i];
        var delta = x - result.mean;
        var sweep = i + 1.0;
        result.mean += delta / sweep;
        sqsum += delta * delta * (i / sweep);
        result.sum += x;
    }
    result.variance = sqsum / result.count;
    result.sdev = Math.sqrt(result.variance);


    return result;
}

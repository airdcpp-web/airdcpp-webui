/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var React = require('react');

var TouchableArea = React.createClass({
  getDefaultProps : function() {
    return {
      touchable: true
    };
  },

  handleTouchStart : function(e) {
    if (!this.props.scroller || !this.props.touchable) {
      return;
    }
    this.props.scroller.doTouchStart(e.touches, e.timeStamp);
  },

  handleTouchMove : function(e) {
    if (!this.props.scroller || !this.props.touchable) {
      return;
    }
    this.props.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
    e.preventDefault();
  },

  handleTouchEnd : function(e) {
    if (!this.props.scroller || !this.props.touchable) {
      return;
    }
    this.props.scroller.doTouchEnd(e.timeStamp);
  },

  render : function() {
    return (
      <div 
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchEnd}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = TouchableArea;

import * as React from 'react'
import {connect} from 'react-redux'
import {StackableJsonTableComponent} from './StackableJsonTable'
import {Actions, actions, RootState} from '../redux'
import {SelectComponent} from './Select'
import {JsonComponent} from './Json'

export class HomeComponent extends React.Component<Props, State> {
  private selectedTable = '__'
  state = {
    json: null,
  }

  render() {
    const {loadingEndpoints, endpoints, tables, records} = this.props
    const countTables = tables.length
    return (
      <div>
        <div className="pt-control-group pt-fill">
          <SelectComponent
            title="Endpoint"
            description={loadingEndpoints ? 'Built-in DynamoDB initializing...' : `Select endpoint from ${endpoints.length} endpoints`}
            onChange={this.handleOnEndpointChange}
          >
            {endpoints.map(({name, endpoint}) => <option key={endpoint} value={endpoint}>{name}</option>)}
          </SelectComponent>
          <SelectComponent
            title="Table"
            description={countTables > 0 ? `Select table from ${countTables} tables` : 'none'}
            onChange={this.handleOnTableChange}
            onZoom={() => {console.log(this.props, this.state); debugger}}
            disabled={countTables === 0}
          >
            {tables.map(({TableName}) => <option key={TableName} value={TableName}>{TableName}</option>)}
          </SelectComponent>
        </div>
        <JsonComponent src={this.state.json || records} onEdit={this.handleJsonEdit}/>
        <StackableJsonTableComponent
          collection={records}
          onItemSelected={this.handleOnItemSelected}
          onRefresh={this.handleOnRefreshRecords}
        />
      </div>
    )
  }

  async componentDidMount() {
    this.props.readEndpoints()
  }

  handleJsonEdit = (prev, next) => {
    console.log('before edit', prev, 'after edit', next)
    this.props.updateRecord(this.selectedTable, next)
    if (!next) {
      if (confirm('delete row?')) {

      }
    }
  }

  handleOnEndpointChange = ev => {
    const value = ev.target.value

    if (!value.startsWith('__')) {
      const endpoint = this.props.endpoints.find(({endpoint}) => endpoint === value)

      if (endpoint) {
        this.props.readTables(endpoint)
      }
    }
    //todo: add
    console.log(value)
  }

  handleOnTableChange = async ev => {
    const value = ev.target.value

    console.log('what')
    if (!value.startsWith('__')) {
      this.props.setTable(value)
      await this.props.readRecords(value)
      //todo: remove selectedTable, it moved redux
      this.selectedTable = value
      return
    }
    this.selectedTable = '__'
    //todo: add
    console.log(value)
  }

  handleOnItemSelected = json => {
    this.setState({json})
  }

  handleOnRefreshRecords = () => {
    if (!this.selectedTable.startsWith('__')) {
      this.props.readRecords(this.selectedTable)
    }
    console.log(this.selectedTable)
  }
}

const mapStateToProps = (state: RootState) => state
const mapDispatchToProps = actions
export const Home = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(HomeComponent)

interface StateProps extends RootState {
}
interface DispatchProps extends Actions {
}
interface OwnProps {
}
interface Props extends StateProps, DispatchProps, OwnProps {
}
interface State {
  json: Object | Array<any>
}
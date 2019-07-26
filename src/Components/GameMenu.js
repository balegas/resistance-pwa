import React from 'react'
import ReactListInput from 'react-list-input';
import Button from '@material-ui/core/Button';

const Input = ({value, onChange, type = 'text'}) =>
    <input type={type} value={value} onChange={e => onChange(e.target.value)}/>;

const style = {
    button: {
        margin: 10,
    },
    input: {
        display: 'none',
    },
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
};

export default class GameMenu extends React.Component {

    Item({decorateHandle, removable, onChange, onRemove, value}) {
        return (
            <div>
                {decorateHandle(<span style={{cursor: 'move'}}>+</span>)}
                <span
                    onClick={removable ? onRemove : x => x}
                    style={{
                        cursor: removable ? 'pointer' : 'not-allowed',
                        color: removable ? 'black' : 'gray'
                    }}>X</span>
                <Input value={value} onChange={onChange}/>
            </div>
        )
    }

    StagingItem({value, onAdd, canAdd, add, onChange}) {
        return (
            <div>
        <span
            onClick={canAdd ? onAdd : undefined}
            style={{
                color: canAdd ? 'black' : 'gray',
                cursor: canAdd ? 'pointer' : 'not-allowed'
            }}
        >Add</span>
                <Input value={value} onChange={onChange}/>
            </div>
        )
    }

    render() {
        return (
            <div>
                <ReactListInput
                    initialStagingValue=''
                    onChange={this.props.updatePlayersIds}
                    maxItems={8}
                    minItems={5}
                    ItemComponent={this.Item}
                    StagingComponent={this.StagingItem}
                    value={this.props.game.playersIds}
                />
                <div>
                    <label>Game Id</label>
                    <Input value={this.props.game.gameId} onChange={this.props.updateGameId}/>
                    <Input value={this.props.game.playerId} onChange={this.props.updatePlayerId}/>
                </div>
                <Button variant="contained" style={style.root} onClick={this.props.enterGame}>
                    Enter Game
                </Button>
            </div>
        )
    }
};

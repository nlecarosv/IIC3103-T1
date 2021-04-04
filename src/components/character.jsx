import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button, ButtonGroup, ButtonToolbar, Container, Divider, List, Loader } from 'rsuite';
import axios from 'axios';
import colors from '../styles/colors';

const Character = ({
  commonApiUrl,
  location,
}) => {
  const params = useParams();
  const history = useHistory();

  const { id: formattedName } = params; 

  const name = formattedName.replace(/\+/g, ' ');
  const show = location?.state?.show ? location.state.show : 'Breaking Bad';
  const [isBreakingBad, setIsBreakingBad] = useState(show === 'Breaking Bad');
  const [breakingBadAppearance, setBreakingBadAppearance] = useState([]);
  const [betterCallSaulAppearance, setBetterCallSaulAppearance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  
  const [appearance, setAppearance] = useState('');
  const [img, setImg] = useState('');
  const [nickname, setNickname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [portrayed, setPortrayed] = useState('');
  const [status, setStatus] = useState('');

  const url = `${commonApiUrl}/characters?name=${formattedName}`;

  useEffect(() => {
    setIsLoading(true);
    axios.get(url)
      .then((response) => {
        if (response.data.length) {
          const character = response.data[0];
          setBreakingBadAppearance(character.appearance);
          setBetterCallSaulAppearance(character.better_call_saul_appearance);
          setAppearance(isBreakingBad ? character.appearance : character.better_call_saul_appearance);
          setImg(character.img);
          setNickname(character.nickname);
          setOccupation(character.occupation);
          setPortrayed(character.portrayed);
          setStatus(character.status)
        } else {
          setIsEmpty(true)
        }
        setIsLoading(false);
      })
      .catch((error) => {
        history.push('/error', { error })
      });
  },
  [params]);

  const handleSeasonClick = (season) => {
    history.push(`/show/${isBreakingBad ? 'Breaking+Bad' : 'Better+Call+Saul'}`, { season })
  }

  const handleChangeShowClick = (appearanceToUse, mode) => {
    setAppearance(appearanceToUse);
    setIsBreakingBad(mode === 'Breaking Bad')
  }

  const getImageDimensions = () => {
    const height = 20 * occupation.length + 8 * (occupation.length - 1)  + 34 + 187 + 20
    return height;
  }

  return(
    <Container>
      {isLoading ? (
        <Loader center content="Cargando"/>
      ) : (
        <Container>
          {isEmpty ? (
            <Container>
            <h1>Lo sentimos, no tenemos registro de {name} en {show}. Revisa que su nombre este bien escrito.</h1>
            </Container>
          ) : (
            <Container style={styles.generalContainer}>
              <Container style={styles.imageAndInformationContainer}>
                <Container style={styles.generalInformationContainer}>
                  <Container>
                    <Container>
                      <h3>{name}</h3>
                    </Container>
                    <Divider style={{color: colors.gray}}/>
                    <Container style={styles.informationContainer}>
                      <p style={styles.informationText}>- Apodo: {nickname}</p>
                      <p style={styles.informationText}>- Estado: {status}</p>
                      <p style={styles.informationText}>- Actor/Actriz{portrayed}</p>
                    </Container>
                  </Container>
                  <Container>
                    <h4>Ocupaciones</h4>
                      {occupation.map((item, index) => (
                        <p key={index.toString()} style={styles.informationText}>- {item}</p>
                      ))}
                  </Container>
                </Container>
                <Container>
                  <img 
                    src={img}
                    height={getImageDimensions()}
                    alt={name}
                    width={getImageDimensions()}
                    style={styles.image}
                    />
                </Container>
              </Container>
              <Container>
                <Container style={styles.seasonsContainer}>
                  <h4 style={styles.text}>Temporadas</h4>
                  <Container>
                    <ButtonToolbar style={styles.buttons}>
                      <ButtonGroup>
                        <Button
                          active={isBreakingBad}
                          appearance="default"
                          onClick={() => handleChangeShowClick(breakingBadAppearance, 'Breaking Bad')}
                          >Breaking Bad
                        </Button>
                        <Button
                          active={!isBreakingBad}
                          appearance="default"
                          onClick={() => handleChangeShowClick(betterCallSaulAppearance, 'Better Call Saul')}
                          >
                          Better Call Saul
                        </Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                    <Divider />
                    {appearance.length ? (
                      <ButtonToolbar style={styles.buttons}>
                        {appearance.map((item, index) => (
                          <Button key={index.toString()} index={index} onClick={() => handleSeasonClick(item)}>
                            {item}
                          </Button>
                        ))}
                      </ButtonToolbar>
                    ): (
                      <p style={styles.text}>No aparece en ninguna temporada</p>
                    )}
                  </Container>
                </Container>
              </Container>
            </Container>
          )}
        </Container>
      )}
    </Container>
  )
};

const styles = {
  text: { textAlign: 'center' },
  buttons: { alignSelf: 'center' },
  seasonsContainer: { margin: 10, marginTop: 20 },
  image: {borderTopRightRadius: 10, borderBottomRightRadius: 10, alignSelf: 'flex-end'},
  informationText: { marginLeft: 10 },
  informationContainer: { backgroundColor: colors.black, margin: 10 },
  generalInformationContainer: { padding: 10 },
  imageAndInformationContainer: { flexDirection: 'row', borderRadius: 10, backgroundColor: colors.black, color: colors.white },
  generalContainer: { margin: 10 },

}

export default Character;
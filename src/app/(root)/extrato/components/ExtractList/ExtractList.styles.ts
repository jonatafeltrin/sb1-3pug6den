import { StyleSheet } from 'react-native';

import { THEME } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  withoutResultText: {
    color: '#9B9B9B',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  transactionCard: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#F3F3F3',
    borderRadius: 10,
    gap: 1,
    opacity: 1,
  },

  underAnalysisTag: {
    backgroundColor: THEME.colors.blue['950'],
    color: 'white',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  iconStyle: {
    marginRight: 5,
  },
  featherStyle: {
    marginRight: 2,
    marginBottom: 5,
  },
  textStyle: {
    color: 'red',
  },
  pointContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  tagIconStyle: {
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
  },
  footerLeftText: {
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: 14,
    marginTop: 4,
  },
  footerDateText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#868686',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '700',
  },
  valuePointsText: {
    fontSize: 14,
    fontWeight: '400',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 4,
  },
});
